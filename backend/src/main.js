import 'dotenv/config';
import { Application } from './Application.js';
import { Config } from './infrastructure/config/Config.js';

const HINT = 'Hint: make sure MySQL is running, backend/.env is filled in and backend/anka.sql has been imported.';

// No top-level await: cPanel's Node.js runner (Passenger) may load this file with require().
new Application(Config.fromEnvironment()).start().catch((error) =>
{
  console.error(`[boot] failed: ${error.message}\n${HINT}`);
  process.exit(1);
});
