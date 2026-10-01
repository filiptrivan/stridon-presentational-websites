// `--key value`, `--key=value` and bare `--flag` arguments.
export function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) {
      args._.push(a);
      continue;
    }
    const eq = a.indexOf("=");
    if (eq > 0) args[a.slice(2, eq)] = a.slice(eq + 1);
    else if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) args[a.slice(2)] = argv[++i];
    else args[a.slice(2)] = true;
  }
  return args;
}

export function print(obj) {
  process.stdout.write(`${JSON.stringify(obj, null, 2)}\n`);
}

export function fail(message, extra = {}) {
  print({ ok: false, error: message, ...extra });
  process.exit(1);
}
