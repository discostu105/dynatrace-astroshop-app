# Environment Configuration

## Setup

The `environmentUrl` is stored in a local configuration file that is **not committed to git** to avoid accidentally sharing environment-specific URLs.

### Initial Setup

1. Copy the template file to create your local config:
   ```bash
   cp app.config.local.template.json app.config.local.json
   ```

2. Edit `app.config.local.json` and set your environment URL:
   ```json
   {
     "environmentUrl": "https://your_tenant.apps.dynatracelabs.com/"
   }
   ```

3. The file `app.config.local.json` is already in `.gitignore` and will not be committed.

### Usage

The npm scripts automatically read the environment URL from `app.config.local.json`:

- `npm run start` - Start dev server with your environment URL
- `npm run deploy` - Deploy to your environment
- `npm run uninstall` - Uninstall from your environment

### Files

- `app.config.json` - Main app configuration (committed to git, no environmentUrl)
- `app.config.local.json` - Local environment URL (NOT committed, you must create this)
- `app.config.local.template.json` - Template for local config (committed to git)
- `scripts/get-env-url.js` - Helper script to read the environment URL
