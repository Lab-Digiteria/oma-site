# Site OMA Oficina — omaoficina.com.br

One page em **Astro** (gera HTML estático) + um arquivo PHP para o formulário.
Hospedagem: VPS Hostinger com CloudPanel (Nginx + PHP-FPM).

## O que editar e onde
| Quero mudar… | Arquivo |
|---|---|
| Telefones, WhatsApp, endereço, horário, redes, avaliações | `src/config/site.ts` |
| IDs de GTM, GA4, Google Ads, Pixel da Meta, verificações | `src/config/site.ts` → `tracking` |
| Textos dos serviços, passos, perguntas, assuntos do formulário | `src/config/conteudo.ts` |
| Layout e textos dos blocos | `src/pages/index.astro` |
| Cores, fontes, espaçamentos | `src/styles/global.css` |
| Logo (trocar pelo vetor) | `public/img/logo-oma.png` e `logo-oma-branco.png` (ou SVG com o mesmo nome e ajuste em `index.astro`) |
| Logo Motul (provisório) | bloco `data-provisorio="motul"` em `index.astro` |

## Gerar e publicar
```bash
npm install
npm run build        # gera a pasta dist/
```
1. No CloudPanel: **Add Site → Create a PHP Site** com o domínio `omaoficina.com.br` (PHP 8.3).
2. Suba o conteúdo de `dist/` para `htdocs/omaoficina.com.br/` (File Manager ou SFTP).
3. Crie `htdocs/oma-privado/` (fora da pasta do site) e copie `deploy/config.exemplo.php` como `config.php` lá dentro.
4. Cole os trechos de `deploy/nginx-omaoficina.conf` no Vhost do site e salve.
5. Aponte o DNS (A/AAAA) para o IP do VPS e emita o SSL (Let’s Encrypt) no CloudPanel.
6. E-mail: o `mail()` do PHP depende de um servidor de envio. Recomendado: SMTP do provedor de e-mail da OMA (ajuste quando as caixas forem criadas) e SPF/DKIM no DNS.

## Rastreamento (pronto para plugar)
- Preencha os IDs em `src/config/site.ts` e rode `npm run build`. ID vazio = nada carrega.
- Aviso de cookies (LGPD) aparece sozinho quando houver qualquer ID. Consent Mode v2 já configurado.
- Eventos no `dataLayer` (para o GTM):
  - `whatsapp_click` (com `origem`: hero, cabecalho, menu, card-<servico>, mitsubishi, motul, como-funciona, rodape, flutuante, barra-fixa)
  - `phone_click`, `route_click`, `email_click`, `social_click`, `reviews_click`, `map_open`
  - `generate_lead` (formulário, com `assunto` e `event_id`)
- Pixel da Meta: `Contact` (WhatsApp/telefone), `Lead` (formulário), `FindLocation` (rota).
- API de Conversões da Meta: preencha `meta_pixel_id` e `meta_capi_token` em `oma-privado/config.php`. O `event_id` deduplica com o Pixel.

## SEO e GEO
- Title/description, Open Graph, canonical, schema `AutoRepair` + `FAQPage` + `WebSite`.
- `sitemap-index.xml` automático, `robots.txt` liberando buscadores e IAs, `llms.txt` com resumo factual.
- Redirecionamentos 301 do WordPress antigo em `deploy/nginx-omaoficina.conf`.

## Formulário
`/api/agendar.php`: recebe nome, WhatsApp e assunto, grava `htdocs/oma-privado/agendamentos.csv`, envia e-mail para recepcao@omaoficina.com.br e (opcional) envia o Lead à Meta. O WhatsApp abre no clique, então o pedido não se perde mesmo se o servidor falhar. O WhatsApp é canal de agendamento de avaliação, nunca de orçamento à distância.

## Ambiente de teste (oma.digiteria.cloud)
```bash
SITE_TESTE=1 npm run build   # bloqueia indexação e desliga todo rastreamento
```
No vhost de teste, acrescente também: `add_header X-Robots-Tag "noindex, nofollow" always;`
Para produção, rode `npm run build` sem a variável.

## Prévia na Vercel
O arquivo `vercel.json` serve só para a prévia de teste na Vercel (sem indexação, sem rastreamento, sem o PHP). Ele não é usado no VPS.
