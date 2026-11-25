// =====================================================================
// OMA Oficina — arquivo único de configuração do site.
// Tudo o que muda com frequência (contatos, IDs de rastreamento, avaliações)
// fica aqui. Depois de editar, rode `npm run build` e suba a pasta dist/.
// =====================================================================

export const site = {
  url: 'https://omaoficina.com.br',
  nome: 'OMA Oficina Multimarcas Automotiva',
  nomeCurto: 'OMA Oficina',
  razaoSocial: 'OMA Oficina Multimarcas Automotiva Ltda.',
  cnpj: '20.641.795/0001-24',

  endereco: {
    rua: 'Rua Antunes Maciel, 47',
    bairro: 'São Cristóvão',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    cep: '20940-010',
    lat: -22.905985,
    lng: -43.2174559,
  },

  horario: {
    texto: 'Segunda a sexta, das 8h às 17h30',
    dias: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    abre: '08:00',
    fecha: '17:30',
  },

  whatsapp: {
    numero: '5521979790437', // só dígitos, com 55 + DDD
    exibicao: '(21) 97979-0437',
    mensagemPadrao:
      'Olá! Vim pelo site da OMA e quero agendar uma avaliação do meu carro na oficina.',
  },

  telefones: [
    { numero: '+552138904377', exibicao: '(21) 3890-4377', principal: true },
    { numero: '+552135561967', exibicao: '(21) 3556-1967' },
    { numero: '+552120297072', exibicao: '(21) 2029-7072' },
  ],

  email: 'recepcao@omaoficina.com.br',

  redes: {
    instagram: 'https://www.instagram.com/omaoficina/',
    facebook: 'https://www.facebook.com/omaoficinamultimarcas',
  },

  googleMaps: {
    placeId: 'ChIJGQT34ZV_mQARnwRExmC-vRg',
    // Rota pelo endereço (o pino do Perfil da Empresa no Google está ~350 m fora do lugar).
    link: 'https://www.google.com/maps/search/?api=1&query=Rua+Antunes+Maciel%2C+47+-+S%C3%A3o+Crist%C3%B3v%C3%A3o%2C+Rio+de+Janeiro+-+RJ%2C+20940-010',
    perfil: 'https://www.google.com/maps/search/?api=1&query=OMA+Oficina+Multimarcas+Automotiva&query_place_id=ChIJGQT34ZV_mQARnwRExmC-vRg',
    avaliar: 'https://search.google.com/local/reviews?placeid=ChIJGQT34ZV_mQARnwRExmC-vRg',
  },

  // Avaliações do Google — atualizar manualmente de tempos em tempos.
  avaliacoes: {
    nota: '4,7',
    total: 52,
    conferidoEm: 'nov/2026',
    trechos: [
      {
        texto:
          'Serviços impecáveis, entende tudo de Mitsubishi. Preço justo pela qualidade do serviço prestado. Muito recomendado, especialmente para donos de Mitsubishi.',
        autor: 'Cliente no Google',
      },
      {
        texto:
          'Oficina excepcionalmente limpa e organizada. Fui muitíssimo bem atendido. Achei o preço justo.',
        autor: 'Cliente no Google',
      },
      {
        texto:
          'Oficina excelente, profissionais qualificados. Ambiente limpo, uma ótima sala de espera. Recomendo.',
        autor: 'Cliente no Google',
      },
    ],
  },
};

// =====================================================================
// RASTREAMENTO — deixe vazio ('') o que ainda não existe.
// Nada é carregado enquanto o ID estiver vazio.
// =====================================================================
export const tracking = {
  gtmId: '', //            ex.: 'GTM-XXXXXXX'  (recomendado: gerencie GA4/Ads por aqui)
  ga4Id: '', //            ex.: 'G-XXXXXXXXXX' (use só se NÃO usar o GTM)
  googleAdsId: '', //      ex.: 'AW-123456789' (use só se NÃO usar o GTM)
  googleAdsLabels: {
    whatsapp: '', //       rótulo da conversão "clique no WhatsApp"
    lead: '', //           rótulo da conversão "formulário enviado"
    telefone: '', //       rótulo da conversão "clique para ligar"
  },
  metaPixelId: '', //      ex.: '123456789012345'
  googleSiteVerification: '', // código do Search Console (meta tag)
  metaDomainVerification: '', // código de verificação de domínio da Meta
};

// =====================================================================
// MODO TESTE — ligado com:  SITE_TESTE=1 npm run build
// Bloqueia indexação (robots.txt + meta noindex) e desliga TODO rastreamento.
// =====================================================================
export const TESTE = process.env.SITE_TESTE === '1';
if (TESTE) {
  for (const k of ['gtmId', 'ga4Id', 'googleAdsId', 'metaPixelId'] as const) (tracking as any)[k] = '';
}
