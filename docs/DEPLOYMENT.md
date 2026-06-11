---
title: Deployment
---

# Deployment

Housing deploys automatically via [Kennel](https://codeberg.org/ScottyLabs/kennel) when changes are pushed to Codeberg `main`.

## URLs

| URL | How it is provisioned |
| --- | --- |
| `https://housing-frontend-main.scottylabs.net` | Default Kennel URL (automatic) |
| `https://cmuhousing.scottylabs.org` | `customDomain` in `devenv.nix`; Kennel creates Cloudflare A record |
| `https://cmuhousing.com` | Manual DNS cutover (see below) |

## Verify a deploy

After pushing to Codeberg `main`, check that Kennel built and deployed:

```bash
curl -sS -o /dev/null -w "%{http_code}" https://housing-frontend-main.scottylabs.net
curl -sS -o /dev/null -w "%{http_code}" https://cmuhousing.scottylabs.org
```

Both should return `200`. Client-side routes (e.g. `/building-options`) should load via SPA fallback.

## cmuhousing.com DNS cutover

Kennel only supports one `customDomain` per site. `cmuhousing.com` must be pointed separately once the Kennel deploy is verified.

1. Confirm `housing-frontend-main.scottylabs.net` and `cmuhousing.scottylabs.org` serve the site.
2. At the `cmuhousing.com` DNS provider, create an **A record** pointing to deploy-01:

   ```
   cmuhousing.com  A  128.2.25.68
   ```

   (deploy-01 campus IP; same host that serves other Kennel routes via Caddy)

3. Optionally add `www.cmuhousing.com` as a CNAME to `cmuhousing.com` or a second A record.
4. Caddy on deploy-01 must have a route for `cmuhousing.com`. If Kennel does not add it automatically, file a DevOps request to add a manual Caddy host block for the housing frontend store path.

## Local validation

```sh
SECRETSPEC_PROVIDER=dotenv://.env devenv build scottylabs.kennel.config
nix build .#packages.x86_64-linux.frontend
```
