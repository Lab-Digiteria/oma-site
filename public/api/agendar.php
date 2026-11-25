<?php
/**
 * OMA Oficina — recebe o formulário de agendamento de avaliação.
 * 1) valida; 2) guarda cópia em CSV fora da pasta pública; 3) envia e-mail para a recepção;
 * 4) (opcional) envia o evento Lead para a API de Conversões da Meta.
 *
 * Configuração sensível fica FORA da pasta pública: htdocs/oma-privado/config.php
 * (veja deploy/config.exemplo.php). Sem esse arquivo, os padrões abaixo valem e a CAPI fica desligada.
 */
declare(strict_types=1);
date_default_timezone_set('America/Sao_Paulo');
header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex');

$cfg = [
    'email_destino' => 'recepcao@omaoficina.com.br',
    'email_remetente' => 'site@omaoficina.com.br',
    'pasta_dados' => dirname(__DIR__, 2) . '/oma-privado',
    'meta_pixel_id' => '',
    'meta_capi_token' => '',
    'meta_test_event_code' => '',
];
$privado = dirname(__DIR__, 2) . '/oma-privado/config.php';
if (is_file($privado)) { $cfg = array_merge($cfg, (array) require $privado); }

function sai(int $code, array $body): void { http_response_code($code); echo json_encode($body, JSON_UNESCAPED_UNICODE); exit; }

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') sai(405, ['ok' => false]);
if (!empty($_POST['site'])) sai(200, ['ok' => true]); // honeypot: robô

$host = (string) parse_url('http://' . ($_SERVER['HTTP_HOST'] ?? ''), PHP_URL_HOST);
$origem = parse_url($_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? ''), PHP_URL_HOST);
if ($origem && $host && strcasecmp($origem, $host) !== 0) sai(403, ['ok' => false]);

$limpa = fn(string $k, int $max) => mb_substr(trim(strip_tags((string) ($_POST[$k] ?? ''))), 0, $max);
$d = [
    'nome' => $limpa('nome', 80),
    'whatsapp' => preg_replace('/\D/', '', $limpa('whatsapp', 20)),
    'assunto' => $limpa('assunto', 80) ?: 'Agendar avaliação do carro',
    'event_id' => preg_replace('/[^A-Za-z0-9\-]/', '', $limpa('event_id', 64)),
];
$erros = [];
if (mb_strlen($d['nome']) < 2) $erros[] = 'nome';
if (strlen($d['whatsapp']) < 10) $erros[] = 'whatsapp';
if ($erros) sai(422, ['ok' => false, 'campos' => $erros]);

// Limite simples: 5 envios por IP a cada 10 minutos.
$ip = $_SERVER['REMOTE_ADDR'] ?? '0';
@mkdir($cfg['pasta_dados'], 0750, true);
$rl = $cfg['pasta_dados'] . '/rl-' . md5($ip) . '.txt';
$marcas = array_filter(explode(',', (string) @file_get_contents($rl)), fn($t) => (int) $t > time() - 600);
if (count($marcas) >= 5) sai(429, ['ok' => false]);
$marcas[] = time();
@file_put_contents($rl, implode(',', $marcas), LOCK_EX);

// 1) Cópia em CSV
$quando = date('Y-m-d H:i:s');
$csv = $cfg['pasta_dados'] . '/agendamentos.csv';
$novo = !is_file($csv);
if ($fh = @fopen($csv, 'a')) {
    if ($novo) fputcsv($fh, ['data', 'nome', 'whatsapp', 'assunto', 'origem']);
    fputcsv($fh, [$quando, $d['nome'], $d['whatsapp'], $d['assunto'], $_SERVER['HTTP_REFERER'] ?? '']);
    fclose($fh);
}

// 2) E-mail para a recepção
$wa = 'https://wa.me/55' . ltrim($d['whatsapp'], '0');
if (str_starts_with($d['whatsapp'], '55') && strlen($d['whatsapp']) > 11) $wa = 'https://wa.me/' . $d['whatsapp'];
$assunto = '=?UTF-8?B?' . base64_encode("Agendamento de avaliação pelo site: {$d['nome']}") . '?=';
$corpo = "Novo pedido de agendamento de avaliação pelo site ({$quando})\n\n"
    . "Nome: {$d['nome']}\nWhatsApp: {$d['whatsapp']}  ->  {$wa}\nAssunto: {$d['assunto']}\n\n"
    . "O cliente também foi direcionado ao WhatsApp da OMA para combinar o dia da avaliação.\n";
$cab = "From: Site OMA <{$cfg['email_remetente']}>\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit";
$enviado = @mail($cfg['email_destino'], $assunto, $corpo, $cab, '-f' . $cfg['email_remetente']);

// 3) API de Conversões da Meta (opcional, deduplicada com o Pixel pelo event_id)
if ($cfg['meta_pixel_id'] && $cfg['meta_capi_token']) {
    $h = fn(string $v) => hash('sha256', mb_strtolower(trim($v)));
    $tel = str_starts_with($d['whatsapp'], '55') ? $d['whatsapp'] : '55' . $d['whatsapp'];
    $partes = preg_split('/\s+/', $d['nome']);
    $evento = [
        'event_name' => 'Lead', 'event_time' => time(), 'action_source' => 'website',
        'event_id' => $d['event_id'] ?: bin2hex(random_bytes(8)),
        'event_source_url' => $_SERVER['HTTP_REFERER'] ?? ('https://' . $host . '/'),
        'user_data' => array_filter([
            'ph' => [$h($tel)], 'fn' => [$h($partes[0] ?? '')], 'ln' => count($partes) > 1 ? [$h(end($partes))] : null,
            'ct' => [$h('riodejaneiro')], 'st' => [$h('rj')], 'country' => [$h('br')],
            'client_ip_address' => $ip, 'client_user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
            'fbp' => $_COOKIE['_fbp'] ?? null, 'fbc' => $_COOKIE['_fbc'] ?? null,
        ]),
        'custom_data' => ['content_name' => 'formulario-agendamento', 'content_category' => $d['assunto']],
    ];
    $payload = ['data' => [$evento]];
    if ($cfg['meta_test_event_code']) $payload['test_event_code'] = $cfg['meta_test_event_code'];
    $ch = curl_init("https://graph.facebook.com/v21.0/{$cfg['meta_pixel_id']}/events?access_token={$cfg['meta_capi_token']}");
    curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => json_encode($payload), CURLOPT_HTTPHEADER => ['Content-Type: application/json'], CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 5]);
    @curl_exec($ch); curl_close($ch);
}

sai(200, ['ok' => true, 'email' => (bool) $enviado]);
