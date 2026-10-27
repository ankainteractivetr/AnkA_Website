import { Container } from './Container.js';

const SHUTDOWN_SIGNALS = ['SIGINT', 'SIGTERM'];

/** Makes sure the CMS account exists, starts the HTTP server and shuts everything down cleanly on exit signals. */
export class Application
{
  #config;
  #container;
  #httpServer;

  constructor(config)
  {
    this.#config = config;
    this.#container = new Container(config);
    this.#httpServer = this.#container.createHttpServer();
  }

  async start()
  {
    await this.#container.ensureAdminUseCase().execute(this.#config.admin);
    const port = await this.#httpServer.listen();
    console.log(`AnkA Interactive API listening on http://localhost:${port} (${this.#config.nodeEnv})`);
    for (const signal of SHUTDOWN_SIGNALS) process.once(signal, () => this.stop());
  }

  async stop()
  {
    await this.#httpServer.close();
    await this.#container.dispose();
    process.exit(0);
  }
}
