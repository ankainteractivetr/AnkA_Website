/** { ok, ts }: whether the database answers, and when this was checked. */
export class CheckHealthUseCase
{
  #probe;

  constructor(probe)
  {
    this.#probe = probe;
  }

  async execute()
  {
    return { ok: await this.#probe.isReachable(), ts: Date.now() };
  }
}
