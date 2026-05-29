import { CLIENT_ID, getRedirectUri } from './config'

const SCOPES = 'playlist-modify-public user-top-read'

function generateRandomString(length: number): string {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = crypto.getRandomValues(new Uint8Array(length))
  return values.reduce((acc, x) => acc + possible[x % possible.length], '')
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder()
  return crypto.subtle.digest('SHA-256', encoder.encode(plain))
}

function base64UrlEncode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  return base64UrlEncode(await sha256(codeVerifier))
}

export async function getAuthUrl(): Promise<string> {
  const redirectUri = getRedirectUri()
  const codeVerifier = generateRandomString(64)
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  sessionStorage.setItem('code_verifier', codeVerifier)
  sessionStorage.setItem('redirect_uri', redirectUri)

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: SCOPES,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  })

  return `https://accounts.spotify.com/authorize?${params}`
}

export async function exchangeCodeForToken(
  code: string,
): Promise<{ access_token: string; expires_in: number }> {
  const codeVerifier = sessionStorage.getItem('code_verifier')
  if (!codeVerifier) {
    throw new Error('Missing code verifier')
  }

  const redirectUri =
    sessionStorage.getItem('redirect_uri') ?? getRedirectUri()

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    const message =
      error.error_description ??
      error.error ??
      'Failed to exchange authorization code for token'
    throw new Error(`${message} (redirect_uri: ${redirectUri})`)
  }

  sessionStorage.removeItem('code_verifier')
  sessionStorage.removeItem('redirect_uri')
  return response.json()
}
