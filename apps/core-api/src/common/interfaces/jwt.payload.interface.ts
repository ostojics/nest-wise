export interface JwtPayload {
  sub: string;
  email: string;
  iss: string;
  iat: number;
  exp: number;
}
