import * as dotenv from 'dotenv';
import * as path from 'path';

[
  path.resolve(process.cwd(), 'apps/api/.env'),
  path.resolve(process.cwd(), '.env'),
].forEach((envPath) => {
  dotenv.config({
    path: envPath,
    override: false,
  });
});

export const golestanConfig = {
  baseUrl: process.env.GOLESTAN_BASE_URL ?? '',
  login: process.env.GOLESTAN_LOGIN ?? '',
  pass: process.env.GOLESTAN_PASS ?? '',
  sec: process.env.GOLESTAN_SEC ?? '',
};
