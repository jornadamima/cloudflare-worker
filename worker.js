addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const path = url.pathname

  const cookieHeader = request.headers.get('Cookie') || ''

  if (cookieHeader.includes('wordpress_logged_in')) {
    return fetch(request)
  }

  const shouldBypass =
    path.startsWith('/wp-json') ||
    path.startsWith('/wp-admin') ||
    path === '/wp-login.php' ||
    path.startsWith('/mimadminpanel') ||
    path.startsWith('/my-account') ||
    /\.(js|css|png|jpg|jpeg|gif|svg|woff2?|ttf|eot|otf|ico|json|xml|txt|map)$/i.test(path)

  if (shouldBypass) {
    return fetch(request)
  }

  const match = cookieHeader.match(/redirect_target=(\w+)/)
  let target = match ? match[1] : null

  if (!target) {
    target = Math.random() < 0.5 ? 'www' : 'loja'
  }

  const redirectUrl = `https://${target}.jornadamima.com.br${path}`

  return new Response('', {
    status: 302,
    headers: {
      'Location': redirectUrl,
      'Set-Cookie': `redirect_target=${target}; Path=/; Max-Age=2592000`
    }
  })
}
