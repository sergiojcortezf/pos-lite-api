import { App } from './app';
import { envs } from './config/envs';

function main() {
  const app = new App();
  app.start(envs.port as number);
}

main();