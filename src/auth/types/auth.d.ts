export type Tokens = {
  refreshToken: string;
  accessToken: string;
};

export type Payload = {
  email: string;
  id: number;
  role: string;
  iat: number;
  exp: number;
};

export type RefreshTokenPayload = {
  id: number;
  email: string;
  iat: number;
  exp: number;
  refreshToken: string;
};
