export const GOOGLE_OAUTH_CONFIG = {
  clientId: '1069628442603-dbe1irihlashj4o4dkmhi5f1b5pi1204.apps.googleusercontent.com',
  redirectUri: 'http://localhost:3000/auth/google/callback',
  scope: 'openid email profile', // ¡IMPORTANTE! openid para id_token
  responseType: 'token id_token',      // <-- Cambia esto
  prompt: 'consent'
} as const

export const GOOGLE_OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'

export const buildGoogleAuthUrl = (state?: string, nonce?: string) => {
  const params = new URLSearchParams({
    client_id: GOOGLE_OAUTH_CONFIG.clientId,
    redirect_uri: GOOGLE_OAUTH_CONFIG.redirectUri,
    scope: GOOGLE_OAUTH_CONFIG.scope,
    response_type: GOOGLE_OAUTH_CONFIG.responseType,
    prompt: GOOGLE_OAUTH_CONFIG.prompt,
    ...(state && { state }),
    ...(nonce && { nonce })
  })
  return `${GOOGLE_OAUTH_URL}?${params.toString()}`
} 