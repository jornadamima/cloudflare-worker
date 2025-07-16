export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const cookieHeader = request.headers.get('Cookie') || '';
    const userAgent = request.headers.get('User-Agent') || '';
    const isBot = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|crawler|spider|robot|crawling/i.test(userAgent);

    // ✅ Se já está logado no WordPress, não redireciona
    if (cookieHeader.includes('wordpress_logged_in')) {
      return fetch(request);
    }

    // ✅ Slugs de blog que devem ser exibidos direto
    const blogSlugs = [
      '/blog',
      '/uso-de-probioticos-em-criancas-na-prevencao-de-alergias',
      '/alimentos-alergenicos',
      '/seletividade-alimentar',
      '/lancheiras-saudaveis',
      '/alergia-alimentar-em-bebes-principais-sinais',
      '/como-oferecer-milho-para-bebe',
      '/kit-para-viagens-com-bebes-e-criancas',
      '/10-alimentos-que-as-gravidas-devem-evitar',
      '/aplv-tem-cura',
      '/alimentacao-do-bebe',
      '/o-que-nao-oferecer-aos-bebes',
      '/lanche-para-criancas',
      '/alimentacao-na-gravidez',
      '/https-jornadamima-com-br-lanche-infantil-saudavel',
      '/alimentos-preferidos',
      '/novos-alimentos',
      '/vitaminas-minerais',
      '/dicas-para-um-carnaval-mais-tranquilo-e-divertido',
      '/alergia-ao-amendoim-em-bebes',
      '/sal-na-comida-do-bebe',
      '/agua-para-o-bebe',
      '/alimentos-que-os-bebes-nao-devem-comer',
      '/introducao-alimentar-de-bebes-vegetarianos',
      '/alergia-a-peixes-e-frutos-do-mar-em-bebes',
      '/frutos-do-mar-para-bebes',
      '/alergia-alimentar-e-amamentacao',
      '/alimentacao-na-gestacao',
      '/cardapio-para-bebes-por-idade',
      '/alimentacao-variada-na-amamentacao',
      '/alimentacao-variada-na-gestacao',
      '/como-oferecer-feijao-para-bebes',
      '/alergia-a-banana-em-bebes',
      '/verdades-e-mentiras-alergias-alimentares',
      '/combater-a-obesidade-infantil',
      '/inicio-da-introducao-alimentar',
      '/ensinar-cuidadores-a-montar-o-pratinho',
      '/papinhas-na-introducao-alimentar',
      '/cardapio-da-creche',
      '/alergia-a-proteina-do-leite-de-vaca-aplv',
      '/importancia-dos-5-grupos-alimentares',
      '/beneficios-da-introducao-alimentar-participativa',
      '/alergia-ao-ovo-em-bebes',
      '/cardapio-variado-para-bebes',
      '/alimentos-alergias-alimentares',
      '/introducao-alimentar-participativa',
      '/alergias-alimentares-em-bebes',
      '/cardapio-do-bebe'
    ];

    // ✅ Ignorar redirecionamento se for bot, subdomínio já redirecionado ou paths técnicos
    const shouldBypass =
      isBot ||
      path.startsWith('/wp-json') ||
      path.startsWith('/wp-admin') ||
      path === '/wp-login.php' ||
      path.startsWith('/mimadminpanel') ||
      path.startsWith('/my-account') ||
      path.startsWith('/blog') ||
      blogSlugs.includes(path) ||
      /\.(js|css|png|jpg|jpeg|gif|svg|woff2?|ttf|eot|otf|ico|json|xml|txt|map)$/i.test(path);

    if (shouldBypass) {
      return fetch(request);
    }

    // ✅ Lógica A/B com cookie
    const match = cookieHeader.match(/redirect_target=(\w+)/);
    let target = match ? match[1] : null;

    if (!target) {
      target = Math.random() < 0.8 ? 'www' : 'loja';
    }

    const redirectUrl = `https://${target}.jornadamima.com.br${path}`;

    return new Response('', {
      status: 302,
      headers: {
        'Location': redirectUrl,
        'Set-Cookie': `redirect_target=${target}; Path=/; Max-Age=2592000`
      }
    });
  }
};
