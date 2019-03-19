import {env} from './env/env.prod';

export const environment = {
  production: true,
  apiServer: env.apiServer,
};
