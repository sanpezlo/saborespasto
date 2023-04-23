export const API_ADDRESS =
  process.env.NEXT_PUBLIC_API_ADDRESS ?? "http://localhost:3000/api";

export const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET ?? "ACCESS_TOKEN_SECRET";
export const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET ?? "REFRESH_TOKEN_SECRET";
export const ACCESS_TOKEN_EXPIRES_IN: number = parseInt(
  process.env.ACCESS_TOKEN_EXPIRES_IN ?? "3600"
);
export const REFRESH_TOKEN_EXPIRES_IN: number = parseInt(
  process.env.REFRESH_TOKEN_EXPIRES_IN ?? "86400"
);
