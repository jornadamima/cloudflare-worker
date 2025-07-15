addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const cookie = request.headers.get('Cookie') || ''
  const match = cookie.match(/redirect_target=(\w+)/)
  let target = match ? match[1] : null

  if (!target) {
    target = Math.random() < 0.5 ? 'www' : 'loja'
  }

  const redirectUrl = `https://${target}.jornadamima.com.br${new URL(request.url).pathname}`

  return new Response('', {
    status: 302,
    headers: {
      'Location': redirectUrl,
      'Set-Cookie': `redirect_target=${target}; Path=/; Max-Age=2592000`
    }
  })
}
