# Ethan Yan Xu Portfolio

This is a personal portfolio website built with [Next.js](https://nextjs.org) and TypeScript to showcase my software projects and collaborations.

## Getting Started

To run locally:

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Production hosting

The portfolio runs on `finprint-host` at `https://www.ethanyanxu.com` and
`https://ethanyanxu.com`. Caddy provides HTTPS and forwards to a Next.js
standalone server on loopback port 3300 or 3301. Both DNS names are DNS-only
CNAMEs to `finprint.ethanyanxu.com`, whose existing DDNS job tracks the home IP.
The existing CAA and verification records remain in place.

Production lives in `C:\ProgramData\Portfolio`, separate from the developer's
checkout. No application secrets or database are needed. YanLearn figures are
read on each page request from its hourly refreshed impact API; other impact
sources retain their hourly cache. Installation maps `learn.ethanyanxu.com` to
`127.0.0.1` in the server's hosts file, keeping requests to the co-hosted app
local while preserving normal HTTPS certificate verification. A hosts backup
is saved under `logs`; remove this mapping if YanLearn moves off this server.
Windows scheduled tasks start the active release
at boot and restart it after a crash; `portfolio-deploy` checks `origin/main`
every two minutes. Vercel Git deployments are disabled in `vercel.json`.

New releases build from the lockfile on the server and must answer `/api/health`
with their exact commit before Caddy switches over. The previous release and
immutable browser assets are retained for rollback and already-open tabs.

Run these commands in an administrator PowerShell **on finprint-host**:

```powershell
# First installation from this repo's deploy/windows directory:
.\install.ps1 -CaddyExe (Get-Command caddy.exe).Source -MainCaddyfile 'C:\Users\ethan\finprint\scripts\selfhost\Caddyfile'

# Build and start without switching public traffic:
& C:\ProgramData\Portfolio\ops\deploy.ps1 -PrepareOnly
& C:\ProgramData\Portfolio\ops\activate.ps1

# Enable automatic deployments only after verifying the first release:
& C:\ProgramData\Portfolio\ops\install.ps1 -CaddyExe (Get-Command caddy.exe).Source -MainCaddyfile 'C:\Users\ethan\finprint\scripts\selfhost\Caddyfile' -EnableAutoDeploy

# Status and logs:
Get-Content C:\ProgramData\Portfolio\active.json
Get-ScheduledTask -TaskName 'portfolio-*'
Get-Content C:\ProgramData\Portfolio\logs\deploy.log -Tail 50

# Roll back; pause the poller so it does not immediately redeploy main:
Disable-ScheduledTask -TaskName portfolio-deploy
& C:\ProgramData\Portfolio\ops\activate.ps1 -Rollback
# Resume after fixing/reverting main:
Enable-ScheduledTask -TaskName portfolio-deploy
```

Deployment errors leave the current release serving. Logs and saved release
metadata live under the runtime directory. Caddy imports the portfolio's own
`Caddyfile`; it is reloaded without restarting the other hosted applications.

## Features

- Modern, animated UI
- Project cards with technology tags and collaborator links
- Responsive design
- "More coming soon!" and a custom footer

## Credits

The style and design of this website are **heavily inspired by [Hyprland's website](https://hypr.land)**, because Hyprland is the best WM in the world.

---

Made with ❤️ by Ethan Yan Xu
