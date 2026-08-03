/// <reference lib="deno.ns" />

/* oxlint-disable */

const targetUrl = new URL("../../frontend/src/api/openapi.json", import.meta.url);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function getSpec(): Promise<unknown> {
  // 1. Try fetching from running server first
  try {
    const res = await fetch("http://localhost:3001/api/docs/json");
    if (res.ok) {
      return (await res.json()) as unknown;
    }
  } catch {
    // Server is not running; launch temporary subprocess below
  }

  // 2. Server not running: spawn index.ts in a temporary background subprocess to fetch spec
  const command = new Deno.Command("deno", {
    args: ["run", "--allow-all", "src/index.ts"],
    env: { PORT: "3001", PGHOST: "localhost", PGDATABASE: "cmu-housing", SKIP_MIGRATIONS: "1" },
    stdout: "null",
    stderr: "null",
  });
  const child = command.spawn();

  let specJson: unknown = null;
  for (let i = 0; i < 25; i++) {
    // oxlint-disable-next-line eslint(no-await-in-loop)
    await sleep(200);
    try {
      // oxlint-disable-next-line eslint(no-await-in-loop)
      const res = await fetch("http://localhost:3001/api/docs/json");
      if (res.ok) {
        // oxlint-disable-next-line eslint(no-await-in-loop)
        specJson = (await res.json()) as unknown;
        break;
      }
    } catch {
      // Retrying...
    }
  }

  child.kill();

  if (specJson) {
    return specJson;
  }
  throw new Error("Failed to generate OpenAPI spec from backend process.");
}

try {
  const spec = await getSpec();
  await Deno.writeTextFile(targetUrl, JSON.stringify(spec, null, 2) + "\n");
  console.log("Updated apps/frontend/src/api/openapi.json");
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
  }
  Deno.exit(1);
}
