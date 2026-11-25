import { site } from './site';

export const wa = (mensagem: string = site.whatsapp.mensagemPadrao) =>
  `https://wa.me/${site.whatsapp.numero}?text=${encodeURIComponent(mensagem)}`;

export const waServico = (servico: string) =>
  wa(`Olá! Vim pelo site da OMA e quero um orçamento de ${servico.toLowerCase()}. Vou informar marca, modelo, ano e chassi do carro.`);

export const fixoPrincipal = site.telefones.find((t) => t.principal) ?? site.telefones[0];

export const img = (nome: string, larguras: number[]) => ({
  avif: larguras.map((w) => `/img/${nome}-${w}.avif ${w}w`).join(', '),
  webp: larguras.map((w) => `/img/${nome}-${w}.webp ${w}w`).join(', '),
  src: `/img/${nome}-${larguras[larguras.length - 1]}.webp`,
});
