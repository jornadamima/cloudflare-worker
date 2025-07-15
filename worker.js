addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const path = url.pathname

  const ignoredPaths = [
    '/wp-admin',
    '/wp-login.php'
  ]

  const isStaticAsset = path.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff2?|ttf|eot|otf|ico|json|xml|txt|map)$/i)

  if (
    path.startsWith('/wp-json') ||
    ignoredPaths.includes(path) ||
    isStaticAsset
  ) {
    return fetch(request)
  }

  const cookie = request.headers.get('Cookie') || ''
  const match = cookie.match(/redirect_target=(\w+)/)
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
