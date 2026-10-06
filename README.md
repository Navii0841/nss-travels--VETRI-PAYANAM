# NSS TRAVELS - வெற்றி பயணம்
College mini-project (HTML/CSS/JS + LocalStorage). No build step, no server needed.

## Run locally
Open the folder in VS Code, right-click `index.html` -> "Open with Live Server".

## Deploy on GitHub Pages
1. Create a new GitHub repo (e.g. `NSS-TRAVELS`).
2. Upload the **contents** of this folder so that `index.html` is at the repo ROOT (not inside another folder).
3. Repo -> Settings -> Pages -> Source: "Deploy from a branch" -> Branch: `main` / `(root)` -> Save.
4. Wait 1-2 minutes. Site: `https://<your-username>.github.io/<repo-name>/`

## Edit
Buses, fares, cities, contact details and UPI ID: top of `js/main.js`. Replace `images/payment-qr.png` to change the QR.
Admin login: top of `js/admin.js` (page: `/admin.html`).

## Notes
LocalStorage is NOT secure and payment is NOT bank-verified - demo only. Data is saved per browser/device only.
Admin password is visible in the public source - demo only. Not an official or government website.
