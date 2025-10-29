import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
    PORT: get('PORT').default('3000').asPortNumber(),
    PUBLIC_PATH: get('PUBLIC_PATH').default('public').asString(),
    JWT_SECRET: get('JWT_SECRET').required().asString(),
};