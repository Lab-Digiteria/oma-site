import { TESTE } from '../config/site';

const producao = `User-agent: *
Allow: /
Disallow: /api/

# Buscadores de IA (GEO): liberados para ler e citar a OMA
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: https://omaoficina.com.br/sitemap-index.xml
`;
const teste = `# Ambiente de teste: não indexar
User-agent: *
Disallow: /
`;
export const GET = () => new Response(TESTE ? teste : producao, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
