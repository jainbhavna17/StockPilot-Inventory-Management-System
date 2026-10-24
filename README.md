# StockPilot – Enterprise Inventory Platform (MERN)

StockPilot split into a full-stack app: **React.js + Redux Toolkit + Tailwind CSS** on the front end, **Node.js + Express.js + MongoDB (Mongoose)** on the back end, secured with **JWT** and role-based access control.

The UI (layout, Tailwind classes, pages, modals, theme toggle, demo roles) is carried over from the original single-file component.

---

## 1. Folder structure

```
stockpilot/
├── package.json                 # root scripts (install:all, dev, seed, build)
├── README.md
├── .gitignore
│
├── server/                      # ───────── BACKEND (Node + Express + MongoDB)
│   ├── package.json
│   ├── .env.example             # copy to .env
│   ├── server.js                # app entry: middleware, routes, DB connect
│   └── src/
│       ├── config/
│       │   └── db.js            # MongoDB connection
│       ├── models/
│       │   ├── User.js          # users + roles + permissions (bcrypt hashed)
│       │   ├── Product.js       # SKU catalog
│       │   ├── Transaction.js   # stock movement ledger
│       │   └── AuditLog.js      # security audit trail
│       ├── middleware/
│       │   ├── authMiddleware.js   # JWT verify (protect) + permission guard (requirePerm)
│       │   └── errorMiddleware.js  # 404 + error handler
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── productController.js
│       │   ├── transactionController.js
│       │   └── auditController.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── productRoutes.js
│       │   ├── transactionRoutes.js
│       │   └── auditRoutes.js
│       └── utils/
│           ├── helpers.js       # timestamp, unique ids, stock status
│           ├── auditLogger.js   # writes audit entries from the server
│           └── seed.js          # loads the original mock data + demo users
│
└── client/                      # ───────── FRONTEND (React + Redux + Tailwind)
    ├── package.json
    ├── index.html
    ├── vite.config.js           # dev server + /api proxy to :5000
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example
    └── src/
        ├── main.jsx             # React root + Redux Provider
        ├── App.jsx              # shell: header, page switch, modals, footer
        ├── index.css            # Tailwind directives
        ├── api/
        │   └── http.js          # axios instance (+ JWT header interceptor)
        ├── store/
        │   ├── store.js
        │   └── slices/
        │       ├── authSlice.js          # login / session restore / logout
        │       ├── uiSlice.js            # theme, page, filters, modals
        │       ├── productsSlice.js      # CRUD thunks + filter/metric selectors
        │       ├── transactionsSlice.js
        │       └── auditSlice.js
        ├── hooks/
        │   ├── useThemeClasses.js   # the original "high contrast" class set
        │   └── useAppActions.js     # goTo / login / logout helpers
        ├── utils/
        │   ├── constants.js         # nav items, demo credentials, categories
        │   └── csv.js               # CSV export
        ├── components/
        │   ├── layout/   Header.jsx, Footer.jsx
        │   └── modals/   ProductModal.jsx, LoginModal.jsx
        └── pages/
            ├── LandingPage.jsx      # Overview
            ├── DashboardPage.jsx    # Catalog Console
            ├── TransactionsPage.jsx # Movements Ledger
            ├── AuditPage.jsx        # Audit Log
            └── AnalyticsPage.jsx    # Analytics
```

---

## 2. Prerequisites

- **Node.js 18+** (check with `node -v`)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) **or** a free MongoDB Atlas connection string

---

## 3. Setup and run

### Step 1 – Install dependencies
From the `stockpilot/` folder:
```bash
npm run install:all
```
(or manually: `npm install`, then `npm install --prefix server`, then `npm install --prefix client`)

### Step 2 – Configure the server
```bash
cd server
cp .env.example .env        # on Windows: copy .env.example .env
```
Edit `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/stockpilot     # or your Atlas URI
JWT_SECRET=put_a_long_random_string_here
JWT_EXPIRES_IN=8h
CLIENT_ORIGIN=http://localhost:5173
```

### Step 3 – Seed the database (once)
Loads the original mock products, ledger entries, audit logs and the 3 demo users:
```bash
npm run seed            # from the stockpilot/ root
```

### Step 4 – Start everything
```bash
npm run dev             # starts API (5000) and React app (5173) together
```
or in two terminals:
```bash
npm run server          # API  -> http://localhost:5000
npm run client          # Web  -> http://localhost:5173
```

Open **http://localhost:5173**.

---

## 4. Demo logins

Click **Sign In** (or use the role dropdown in the header). All demo users share the password `Password@123`.

| Role              | Email                    | Permissions                         |
|-------------------|--------------------------|-------------------------------------|
| Admin (John)      | admin@stockpilot.io      | Create, Read, Update, Delete, Audit |
| Manager (Sarah)   | manager@stockpilot.io    | Create, Read, Update                |
| Viewer (Alex)     | viewer@stockpilot.io     | Read only                           |

---

## 5. API reference

All routes except `login` need the header `Authorization: Bearer <token>`.

| Method | Route                  | Permission | Description                                     |
|--------|------------------------|------------|-------------------------------------------------|
| POST   | `/api/auth/login`      | public     | `{ email, password }` → `{ token, user }`       |
| GET    | `/api/auth/me`         | any        | Current user (used to restore a session)        |
| POST   | `/api/auth/logout`     | any        | Writes a `SESSION_TERMINATED` audit entry       |
| GET    | `/api/products`        | READ       | List SKUs                                       |
| POST   | `/api/products`        | CREATE     | Add SKU (also writes ledger + audit entries)    |
| PUT    | `/api/products/:id`    | UPDATE     | Edit SKU (also writes ledger + audit entries)   |
| DELETE | `/api/products/:id`    | DELETE     | Delete SKU (audit entry)                        |
| GET    | `/api/transactions`    | READ       | Stock movements ledger                          |
| GET    | `/api/audit`           | READ       | Security audit log                              |
| POST   | `/api/audit`           | READ       | Record client events (e.g. `CSV_EXPORT`)        |

---

## 6. How the original code maps to the new stack

| Original (single file)                 | Now                                                        |
|----------------------------------------|------------------------------------------------------------|
| `INITIAL_PRODUCTS / TRANSACTIONS / AUDIT_LOGS` | MongoDB collections, loaded by `server/src/utils/seed.js` |
| `PRESET_USERS` + `perms`               | `User` model; permissions enforced by `requirePerm` middleware |
| mock `sessionToken`                    | real signed JWT (`jsonwebtoken`), stored in `localStorage` |
| `useState` hooks                       | Redux Toolkit slices (`auth`, `ui`, `products`, `transactions`, `audit`) |
| `useMemo` filters / metrics            | selectors in `productsSlice.js`                            |
| `logSecurityAction()`                  | server-side `logAudit()` on every action                   |
| `handleSaveProduct / handleDeleteProduct` | thunks calling `/api/products`                          |
| one big `App` component                | `Header`, `Footer`, 5 pages, 2 modals                      |

### Small behaviour differences (needed once there is a real backend)
- The app starts **signed out**; the original started signed in as Admin. Protected pages (everything except Overview) open the sign-in modal until you log in. "Launch Admin Sandbox" still signs you in as Admin in one click.
- Permissions are enforced on the **server** too, not just by hiding buttons.
- Tailwind is set to `darkMode: 'class'` and the theme toggle adds/removes the `dark` class, so the `dark:` utility classes now follow the toggle (originally they followed the OS setting).

---

## 7. Production build

```bash
npm run build                    # outputs client/dist
```
Serve `client/dist` from any static host and set `VITE_API_URL` (e.g. `https://api.yourdomain.com/api`) before building. Set `CLIENT_ORIGIN` on the server to your front-end URL, use a strong `JWT_SECRET`, and remove or change the demo users/password.

## 8. Troubleshooting

- **`MongoDB connection error`** – make sure `mongod` is running or fix `MONGO_URI`.
- **Login says "Invalid email or password"** – run `npm run seed` first.
- **Blank data / 401 errors** – sign out and sign in again (token may have expired).
- **CORS error** – `CLIENT_ORIGIN` in `server/.env` must match the URL the React app runs on.
