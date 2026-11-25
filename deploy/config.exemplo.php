<?php
// Copie para FORA da pasta pública: /home/<usuario-do-site>/htdocs/oma-privado/config.php
// (ao lado da pasta htdocs/omaoficina.com.br, nunca dentro dela). Nunca suba este arquivo preenchido para a pasta pública.
return [
    'email_destino'        => 'recepcao@omaoficina.com.br',
    'email_remetente'      => 'site@omaoficina.com.br', // precisa ser autorizado no SPF do domínio
    'meta_pixel_id'        => '',  // mesmo ID do Pixel em src/config/site.ts
    'meta_capi_token'      => '',  // token da API de Conversões (Gerenciador de Eventos)
    'meta_test_event_code' => '',  // preencha só durante o teste (ex.: TEST12345)
];
