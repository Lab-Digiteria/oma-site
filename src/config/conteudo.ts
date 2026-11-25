// Textos e listas da página. Editar aqui muda o site e os dados estruturados juntos.

export type Servico = {
  id: string;
  nome: string;
  linha: string;
  icone: string; // nome do ícone em src/components/Icone.astro
};

export const servicos: Servico[] = [
  {
    id: 'troca-de-oleo',
    nome: 'Troca de óleo',
    linha: 'Lubrificantes Motul na especificação de cada fabricante, inclusive para clássicos.',
    icone: 'oleo',
  },
  {
    id: 'revisao',
    nome: 'Revisões programadas',
    linha: 'Itens conferidos pela quilometragem e pelo plano do fabricante.',
    icone: 'revisao',
  },
  {
    id: 'mecanica-eletronica',
    nome: 'Mecânica, elétrica e eletrônica',
    linha: 'Diagnose com scanners para todas as marcas e inspeção por boroscópio.',
    icone: 'scanner',
  },
  {
    id: 'cambio-automatico',
    nome: 'Câmbio automático',
    linha: 'Troca de fluido e manutenção de câmbios automáticos e CVT.',
    icone: 'cambio',
  },
  {
    id: 'alinhamento',
    nome: 'Alinhamento 3D e balanceamento',
    linha: 'Direção, cambagem e caster, com rodas e pneus até 24".',
    icone: 'roda',
  },
  {
    id: 'funilaria-pintura',
    nome: 'Funilaria e pintura',
    linha: 'Cabine de pintura e tinta à base d’água Glasurit/BASF.',
    icone: 'pintura',
  },
  {
    id: 'ar-condicionado',
    nome: 'Ar-condicionado',
    linha: 'Diagnose, higienização, reciclagem e recarga de gás.',
    icone: 'ar',
  },
  {
    id: 'pre-vistoria',
    nome: 'Pré-vistoria de licenciamento',
    linha: 'Revisão antes da vistoria anual, para não ter surpresa no dia.',
    icone: 'vistoria',
  },
];

export const numeros = [
  { valor: '1.400 m²', rotulo: 'de oficina' },
  { valor: '6', rotulo: 'elevadores até 3,5 t' },
  { valor: '24"', rotulo: 'rodas e pneus' },
  { valor: '24 h', rotulo: 'monitoramento' },
];

export const passos = [
  {
    titulo: 'Agende a avaliação',
    texto: 'Pelo WhatsApp ou pelo formulário, no dia e horário que forem melhores para você.',
  },
  {
    titulo: 'Avaliação na oficina',
    texto: 'Nossa equipe examina o carro de perto, com diagnose, para saber exatamente o que ele precisa.',
  },
  {
    titulo: 'Orçamento e aprovação',
    texto: 'Você recebe o orçamento com base no que foi avaliado. O serviço só começa depois da sua aprovação.',
  },
];

export const sustentabilidade = [
  'Tinta à base d’água, sem compostos orgânicos voláteis',
  'Água da chuva reaproveitada na lavagem dos carros',
  'Resíduos recolhidos por empresa credenciada',
  'Ventilação com filtragem de poluentes',
];

export const faq = [
  {
    p: 'Quais marcas a OMA atende?',
    r: 'Carros nacionais e importados de todas as marcas. A especialidade da casa é Mitsubishi.',
  },
  {
    p: 'Vocês fazem orçamento pelo WhatsApp?',
    r: 'Não. O orçamento é feito depois da avaliação do carro na oficina, para ser preciso e sem surpresas. Pelo WhatsApp você agenda essa avaliação.',
  },
  {
    p: 'Onde fica a oficina?',
    r: 'Na Rua Antunes Maciel, 47, em São Cristóvão, Rio de Janeiro. Fácil acesso para quem vem da Zona Sul, do Centro, da Barra e da Zona Norte.',
  },
  {
    p: 'Qual o horário de funcionamento?',
    r: 'Segunda a sexta, das 8h às 17h30.',
  },
  {
    p: 'Que óleo vocês usam?',
    r: 'Lubrificantes Motul, marca parceira da OMA, sempre na especificação indicada pelo fabricante do carro.',
  },
  {
    p: 'Vocês fazem funilaria e pintura?',
    r: 'Sim. A pintura é feita em cabine, com tinta à base d’água Glasurit/BASF.',
  },
  {
    p: 'O serviço começa sem minha autorização?',
    r: 'Não. Você recebe o orçamento e o serviço só começa depois da sua aprovação.',
  },
];

export const assuntos = [
  'Agendar avaliação do carro',
  ...servicos.map((s) => `Avaliação: ${s.nome.charAt(0).toLowerCase() + s.nome.slice(1)}`),
  'Outro assunto',
];
