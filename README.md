# RateMyStore - Full-Stack Store Rating Platform

[cite_start]RateMyStore is a secure, full-stack web application built using the MERN/PERN stack (ExpressJS, ReactJS, and PostgreSQL)[cite: 2, 3, 4]. [cite_start]The platform implements a unified single-login system that dynamically provisions distinct analytical workspaces and system permissions for System Administrators, Normal Users, and Store Owners based on live database status[cite: 8, 9, 11].

---

## 🚀 Live Links & Mock Credentials

* **Live Deployment Link:** `[Insert your Render/Vercel link here if deployed]`
* **GitHub Repository:** `[Insert your GitHub repository link here]`

### 🔑 Seeded Test Credentials
Use these pre-configured profiles to instantly evaluate different system boundaries without manually modifying tables:

| Role | Email Address | Password | Workspace Features |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@admin.com` | `Admin@123` | [cite_start]Global metrics, multi-table creation, user/store registry filters [cite: 16, 17, 18, 33] |
| **Store Owner (Merchant)** | `store@example.com` | `Owner@123` | [cite_start]Interactive progress distribution bar charts, chronological reviewer trace [cite: 55, 58, 59, 60] |
| **Normal User (Consumer)** | `user@example.com` | `User@123` | [cite_start]Live searchable storefront feed, star input components with dynamic UPSERT updates [cite: 36, 44, 45, 51, 52] |

---

## 🛠️ Architecture & System Design Highlights

### 1. Robust Security Clearances
* **Tamper-Proof Tokens:** Rest API pathways are fortified behind a custom asymmetric JWT `protect` validation middleware layer.
* **Live DB Verification:** To prevent client-side spoofing or token-payload manipulation, specialized endpoints query the NeonDB live truth tables synchronously via a backend authorization guard (`verifyUserRole`) to double-check active account statuses in real-time.
* [cite_start]**Input Integrity Protection:** Strict validation bounds are compiled on both frontend forms (via React Hook Form) and the backend (via Express validation filters) matching project specs exactly[cite: 62]:
    * [cite_start]**Name:** Explicitly constrained to $20 \le \text{length} \le 60$ characters[cite: 63].
    * [cite_start]**Address:** Constrained to a maximum threshold of 400 characters[cite: 64].
    * [cite_start]**Password:** Strictly validated via regex checking for 8-16 characters with at least one uppercase letter and one special symbol[cite: 65, 66].

### 2. High-Performance Relational Queries
* [cite_start]**Conflict-Resistant Rating Submissions (`UPSERT`):** Consumer feedback scoring runs on an atomic `INSERT ... ON CONFLICT (user_id, store_id) DO UPDATE` query execution tree[cite: 7, 53]. [cite_start]This gives users a seamless option to submit or dynamically modify an existing star score in a single query[cite: 51, 52].
* **Atomic Combined Registration:** Admin-driven store creation is executed inside a safe database transaction block (`BEGIN` / `COMMIT`). If an error hits (e.g., email duplicate checks), the pipeline triggers an immediate `ROLLBACK`, preventing orphaned users or broken data maps.
* [cite_start]**Server-Side Global Table Sorting:** All dynamic tabular UI listings handle sorting natively by tying interactive table header cells directly to a reusable sorting utility hook across key data fields[cite: 69].

---

## 📂 Project Repository Directory Tree

```text
├── backend/
│   ├── config/          # Database connection pool engines (NeonDB/PostgreSQL)
│   ├── controllers/     # Modular Request-Response logic handlers (Auth, Admin, Store)
│   ├── middleware/      # JWT protection and strict role clearance blockades
│   ├── routes/          # Express API route mapping endpoints
│   └── server.js        # Root system application bootstrapper entry point
└── frontend/
    ├── src/
    │   ├── components/  # Layouts, Custom Modals, Star Displays, Badges
    │   ├── context/     # StoreContext global state engine (Dynamic debounce searches & re-fetches)
    │   ├── hooks/       # Reusable useSortableTable logic hooks
    │   ├── services/    # Centralized Axios interceptor client configuration instance
    │   └── main.jsx     # Render entry tree node