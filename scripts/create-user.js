import 'dotenv/config';
import { init, createUser, isPgEnabled } from '../apps/crm/db.js';

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, v] = a.split('=');
      const key = k.replace(/^--/, '');
      if (v !== undefined) out[key] = v; else if (argv[i+1] && !argv[i+1].startsWith('--')) { out[key] = argv[i+1]; i++; }
      else out[key] = true;
    }
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv);
  const email = args.email || process.env.EMAIL;
  const password = args.password || process.env.PASSWORD;
  const role = (args.role || process.env.ROLE || 'agent').toLowerCase();
  if (!email || !password) {
    console.error('Usage: node scripts/create-user.js --email user@example.com --password "Secret123" [--role admin|agent]');
    process.exit(2);
  }
  if (!['admin','agent'].includes(role)) {
    console.error('Invalid role. Use "admin" or "agent"');
    process.exit(2);
  }
  try {
    await init();
    const u = await createUser({ email, password, role });
    console.log(`[ok] user created: ${u.email} (role=${u.role}) storage=${isPgEnabled()?'pg':'json'}`);
    process.exit(0);
  } catch (e) {
    console.error('[error] create-user failed:', e?.message || e);
    process.exit(1);
  }
}

main();
