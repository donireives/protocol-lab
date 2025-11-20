import dotenv from 'dotenv';

dotenv.config();

const parsePort = (value?: string): number => {
  const fallback = 8000;
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const env = {
  port: parsePort(process.env.PORT),
  apiKey: process.env.API_KEY ?? 'dev-protocol-key'
};
