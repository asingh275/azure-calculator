# Simple Calculator - Azure App Service Demo (AZ-104 Practice)

A minimal Node.js/Express calculator app, built purely so you have something
easy to deploy to Azure App Service via GitHub, and to practice **deployment
slots**.

## What's here

- `server.js` - tiny Express server, serves the static calculator page and
  a `/api/version` endpoint (useful for telling slots apart)
- `public/index.html` - the calculator UI (plain HTML/CSS/JS, no build step)
- `.github/workflows/azure-deploy.yml` - GitHub Actions workflow to deploy
  to Azure App Service on every push to `main`
- `package.json` - dependencies (just Express)

## 1. Run it locally (optional)

```bash
npm install
npm start
```

Visit http://localhost:3000

## 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial calculator app"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## 3. Create the Azure App Service

In the Azure Portal (or CLI):

- **App Service Plan**: pick at least the **Basic (B1)** tier or higher —
  the **Free (F1) tier does not support deployment slots**, which is the
  whole point of this exercise.
- **Runtime stack**: Node 18 LTS, Linux or Windows (Linux is simpler/cheaper).
- **Publish**: Code.

CLI equivalent:

```bash
az group create --name rg-calc-demo --location eastus

az appservice plan create --name plan-calc-demo --resource-group rg-calc-demo \
  --sku B1 --is-linux

az webapp create --name <your-unique-app-name> --resource-group rg-calc-demo \
  --plan plan-calc-demo --runtime "NODE:18-lts"
```

## 4. Set up GitHub Actions deployment

1. In the Azure Portal, go to your Web App → **Get publish profile** (download it).
2. In your GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Value: paste the contents of the publish profile file.
3. Edit `.github/workflows/azure-deploy.yml` and set `AZURE_WEBAPP_NAME` to
   your actual app name.
4. Push to `main` (or run the workflow manually from the Actions tab) —
   it should deploy automatically.

## 5. Practice deployment slots (the AZ-104 part)

1. In the Azure Portal, on your Web App, go to **Deployment slots → Add Slot**.
   Create a slot called `staging`, cloning settings from production.
2. Deploy a *different* version of the app to the staging slot so you can
   visually tell them apart. Easiest way:
   - Change something visible, e.g. edit `public/index.html` and change the
     background color, or bump the version string in `server.js`.
   - Also set an **App Setting** unique to each slot so `/api/version` shows
     it: in the slot's **Configuration → Application settings**, add
     `SLOT_NAME = staging` (and `SLOT_NAME = production` on the main site).
     Make sure this setting is marked as a **"Deployment slot setting"**
     (sticky) so it doesn't swap with the slot.
   - Deploy this changed version specifically to the `staging` slot:
     - Either update the GitHub Actions workflow to target the slot
       (`slot-name: staging`, using a separate publish profile for the slot),
       or deploy manually via `az webapp deployment slot`.
3. Browse both URLs:
   - Production: `https://<your-app-name>.azurewebsites.net`
   - Staging slot: `https://<your-app-name>-staging.azurewebsites.net`
   - The colored banner at the top of the calculator will show which slot
     you're hitting.
4. **Swap slots**: Portal → Deployment slots → **Swap** (staging → production).
   Refresh both URLs and confirm the content swapped — this is the core
   AZ-104 concept: near-zero-downtime deployment by swapping a
   pre-warmed staging slot into production.
5. Try **swap with preview**, and also try rolling back by swapping again.

## Notes

- The calculator itself uses `eval()` for simplicity — fine for this
  learning exercise, not something to ship in a real product.
- Free (F1) App Service plan does **not** support slots — use Basic (B1) or above.
