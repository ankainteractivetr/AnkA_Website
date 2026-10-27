/** GET /api/health → { ok, ts }; 503 while the database is unreachable. */
export class HealthController
{
  #checkHealth;

  constructor(checkHealth)
  {
    this.#checkHealth = checkHealth;
  }

  check = async (_req, res) =>
  {
    const health = await this.#checkHealth.execute();
    res.status(health.ok ? 200 : 503).json(health);
  };
}
