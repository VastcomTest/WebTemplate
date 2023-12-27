type Token = {
  aud:string,
  exp:number,
  iss:string,
  // permission[]
  scopes:string[]
}

export function getTokenInfo(token:string):Token{
  const tokenBase64 = token!.split('.')[1];
  const tokenString = window.atob(tokenBase64);
  const parsedtoken = JSON.parse(tokenString);
  return parsedtoken as Token
}