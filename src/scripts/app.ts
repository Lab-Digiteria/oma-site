// OMA — interações e rastreamento. Sem dependências.
declare global {
  interface Window { dataLayer: any[]; gtag?: (...a: any[]) => void; fbq?: (...a: any[]) => void; OMA_TRACK: any; OMA_loadPixel?: () => void }
}
const T = window.OMA_TRACK || {};
const uid = () => (crypto as any).randomUUID?.() || Date.now() + '-' + Math.random().toString(16).slice(2);

// ---------- Eventos de conversão ----------
function track(evento: string, dados: Record<string, any> = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: evento, ...dados });
  const labels = T.adsLabels || {};
  const mapaMeta: Record<string, string> = { whatsapp_click: 'Contact', phone_click: 'Contact', generate_lead: 'Lead', route_click: 'FindLocation' };
  if (window.fbq && mapaMeta[evento]) window.fbq('track', mapaMeta[evento], { content_name: dados.origem }, dados.event_id ? { eventID: dados.event_id } : undefined);
  if (!T.gtm && window.gtag) {
    if (T.ga4) window.gtag('event', evento, dados);
    const lab = evento === 'whatsapp_click' ? labels.whatsapp : evento === 'generate_lead' ? labels.lead : evento === 'phone_click' ? labels.telefone : '';
    if (T.ads && lab) window.gtag('event', 'conversion', { send_to: `${T.ads}/${lab}` });
  }
}
const nomesEvento: Record<string, string> = {
  whatsapp: 'whatsapp_click', telefone: 'phone_click', rota: 'route_click',
  email: 'email_click', social: 'social_click', avaliacoes: 'reviews_click',
};
document.addEventListener('click', (ev) => {
  const a = (ev.target as Element).closest<HTMLElement>('[data-track]');
  if (!a) return;
  const ev2 = nomesEvento[a.dataset.track || ''];
  if (ev2) track(ev2, { origem: a.dataset.origem || '' });
});

// ---------- Menu do celular ----------
const btnMenu = document.querySelector<HTMLButtonElement>('.cab__menu');
const fecharMenu = () => { document.documentElement.classList.remove('menu-aberto'); btnMenu?.setAttribute('aria-expanded', 'false'); btnMenu?.setAttribute('aria-label', 'Abrir menu'); };
btnMenu?.addEventListener('click', () => {
  const aberto = document.documentElement.classList.toggle('menu-aberto');
  btnMenu.setAttribute('aria-expanded', String(aberto));
  btnMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
});
document.querySelectorAll('#menu a').forEach((a) => a.addEventListener('click', fecharMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharMenu(); });

// ---------- Pista: progresso da rolagem ----------
const pista = document.querySelector<HTMLElement>('.pista');
let agendado = false;
const atualiza = () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  pista?.style.setProperty('--p', String(h > 0 ? Math.min(1, scrollY / h) : 0));
  agendado = false;
};
addEventListener('scroll', () => { if (!agendado) { agendado = true; requestAnimationFrame(atualiza); } }, { passive: true });
atualiza();

// ---------- Mapa sob demanda (não pesa no carregamento) ----------
const mapa = document.querySelector<HTMLElement>('.rodape__mapa');
mapa?.querySelector('button')?.addEventListener('click', () => {
  const f = document.createElement('iframe');
  f.src = mapa.dataset.mapa || ''; f.title = 'Mapa da OMA Oficina'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
  mapa.innerHTML = ''; mapa.appendChild(f); track('map_open', { origem: 'rodape' });
});

// ---------- Cookies (só se houver rastreamento configurado) ----------
const temTrack = !!(T.gtm || T.ga4 || T.ads || T.pixel);
const aviso = document.querySelector<HTMLElement>('.cookies');
let escolha: string | null = null;
try { escolha = localStorage.getItem('oma-consent'); } catch {}
if (temTrack && !escolha && aviso) aviso.hidden = false;
aviso?.querySelectorAll<HTMLButtonElement>('[data-consent]').forEach((b) => b.addEventListener('click', () => {
  const v = b.dataset.consent!;
  try { localStorage.setItem('oma-consent', v); } catch {}
  const g = v === 'all' ? 'granted' : 'denied';
  window.gtag?.('consent', 'update', { ad_storage: g, analytics_storage: g, ad_user_data: g, ad_personalization: g });
  if (v === 'all') window.OMA_loadPixel?.();
  aviso.hidden = true;
}));

// ---------- Formulário de orçamento ----------
const form = document.querySelector<HTMLFormElement>('#form-orcamento');
if (form) {
  const erro = form.querySelector<HTMLElement>('.form__erro')!;
  const tel = form.elements.namedItem('whatsapp') as HTMLInputElement;
  const chassi = form.elements.namedItem('chassi') as HTMLInputElement;
  const ano = form.elements.namedItem('ano') as HTMLInputElement;

  tel.addEventListener('input', () => {
    let d = tel.value.replace(/\D/g, '').slice(0, 11);
    tel.value = d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}` : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
  });
  chassi.addEventListener('input', () => { chassi.value = chassi.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, ''); });
  ano.addEventListener('input', () => { ano.value = ano.value.replace(/\D/g, '').slice(0, 4); });

  const valida = (): string => {
    const f = new FormData(form);
    const marca = (el: string, bad: boolean) => (form.elements.namedItem(el) as HTMLElement).setAttribute('aria-invalid', String(bad));
    const nome = String(f.get('nome') || '').trim();
    const t = String(f.get('whatsapp') || '').replace(/\D/g, '');
    const fab = String(f.get('fabricante') || '');
    const mod = String(f.get('modelo') || '').trim();
    const a = Number(f.get('ano'));
    const c = String(f.get('chassi') || '');
    const anoMax = new Date().getFullYear() + 1;
    const erros: string[] = [];
    marca('nome', nome.length < 2); if (nome.length < 2) erros.push('seu nome');
    marca('whatsapp', t.length < 10); if (t.length < 10) erros.push('um WhatsApp com DDD');
    marca('fabricante', !fab); if (!fab) erros.push('o fabricante');
    marca('modelo', !mod); if (!mod) erros.push('o modelo');
    const anoRuim = !(a >= 1950 && a <= anoMax); marca('ano', anoRuim); if (anoRuim) erros.push('o ano com 4 dígitos');
    marca('chassi', c.length !== 17); if (c.length !== 17) erros.push('o chassi com 17 caracteres');
    return erros.length ? `Falta preencher ${erros.join(', ').replace(/, ([^,]*)$/, ' e $1')}.` : '';
  };

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const msg = valida();
    if (msg) { erro.textContent = msg; erro.hidden = false; (form.querySelector('[aria-invalid="true"]') as HTMLElement)?.focus(); return; }
    erro.hidden = true;
    const id = uid();
    (form.elements.namedItem('event_id') as HTMLInputElement).value = id;
    const f = new FormData(form);
    const texto = [
      'Olá! Vim pelo site da OMA e quero um orçamento.',
      `Nome: ${f.get('nome')}`,
      `Veículo: ${f.get('fabricante')} ${f.get('modelo')} ${f.get('ano')}`,
      `Chassi: ${f.get('chassi')}`,
    ].join('\n');
    const link = `https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(texto)}`;

    // Abre o WhatsApp já (no clique), para não ser bloqueado como pop-up.
    const janela = window.open(link, '_blank');
    if (janela) janela.opener = null;
    track('generate_lead', { origem: 'formulario', fabricante: f.get('fabricante'), event_id: id });

    const ok = form.querySelector<HTMLElement>('.form__ok')!;
    ok.querySelector<HTMLAnchorElement>('.form__ok-link')!.href = link;
    ok.hidden = false;
    if (!janela) location.href = link;

    try {
      const ctrl = new AbortController(); setTimeout(() => ctrl.abort(), 8000);
      await fetch(form.action, { method: 'POST', body: f, signal: ctrl.signal, keepalive: true });
    } catch { /* O WhatsApp já abriu: o lead não se perde se o servidor falhar. */ }
  });
}
export {};
