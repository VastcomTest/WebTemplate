export default {
  oidc: {
    clientId: '0oa7hziikwdJr60zx697',
    issuer: 'https://trial-5503631.okta.com/oauth2/default',
    redirectUri: window.location.origin + '/auth/callback/okta',
    postLogoutRedirectUri:`${window.location.origin}/auth/login`,
    scopes: ['openid', 'profile', 'email']
  }
}