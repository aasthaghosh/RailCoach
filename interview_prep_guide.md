# 🚆 RailCoach Management System: Interview Prep Guide

This guide is structured to help you confidently present the project, explain your role, and answer technical questions during your interview.

---

## 1. Project Overview (Elevator Pitch)
The **RailCoach Management System** is a full-stack web application designed to streamline railway coach maintenance operations. It serves as a central hub where railway administrators can register staff, track coach statuses (Active, Under Maintenance, Out of Service), and manage maintenance requests.
* **Why it matters:** In railway operations, safety and organization are paramount. This system helps prevent communication breakdowns between departments (Mechanical, Electrical, etc.) by ensuring all tasks are logged, prioritized, assigned, and approved through a secure, structured pipeline.

---

## 2. The Tech Stack
* **Frontend:** React (Vite-powered), Tailwind CSS (for modern UI styling), React Router DOM (v7 for declarative routing), Axios, Recharts (for dashboard metrics/analytics).
* **Backend:** Node.js, Express (REST API development).
* **Database:** MongoDB with Mongoose (Object Document Mapper) for structured schemas.
* **Security & Auth:** JSON Web Tokens (JWT), Bcrypt (password hashing), Cookie-Parser.

---

## 3. Your Role: Authentication & Role Management
As the developer responsible for authentication and role management, you established the application's entire security foundation. Here is exactly what you did:

### A. Secure Password Hashing
* Used **Bcrypt** with **10 salt rounds** to hash user passwords on signup.
* Prevented plain-text password storage in the database.
* Handled password verification on login securely using `bcrypt.compare`.

### B. JWT-based Stateless Authentication
* Implemented stateless sessions using **JSON Web Tokens (JWT)**.
* Upon successful login, a JWT token is generated (with a 2-hour expiration time) containing the user’s ID, email, and role as the payload.
* **Cookie-Based Security:** Instead of storing the JWT in `localStorage` (which is vulnerable to Cross-Site Scripting or XSS), you stored the token in an **HttpOnly cookie** for maximum frontend security.

### C. Role-Based Access Control (RBAC) & Middleware
You designed a robust, two-tier authorization layer:
1. **`AdminAuth` Middleware:** Extracts the JWT from request cookies, verifies it using the server's secret token, and attaches the payload (`id`, `email`, `role`) to the `req.user` object. This ensures the request comes from an authenticated user.
2. **`isadmin` Middleware:** An extra security check that queries the database to confirm the authenticated user actually has the `"admin"` role, preventing non-admin staff from accessing restricted APIs.

### D. Centralized Signups (Delegated Access)
* In a railway environment, allowing anyone to register an account is a security risk.
* You implemented a design where the **Signup page and endpoint are protected by Admin middleware**. Only a logged-in admin can create new accounts and assign roles (like `mechanical`, `electrical`, `engineering`, etc.).

### E. Deterministic Railway ID Generation
* On the frontend, you wrote a browser-safe cryptographic utility using the Web Crypto API (`window.crypto.subtle.digest`).
* It hashes the user's first name and email using **SHA-256** to generate a unique, deterministic **8-character hex-based Railway ID** (e.g., `e8a9cf2b`), which is used as their primary credential for logging in.

### F. Active Session & Status Tracking (Bonus Feature)
* Built a tracking mechanism to calculate active work sessions.
* **On Login:** Set `status: "online"` and recorded `lastLoginAt = new Date()`.
* **On Logout:** Recorded `lastLogoutAt = new Date()`, calculated the difference in milliseconds, accumulated it under `totalWorkTime` in the user document, and set `status: "offline"`.
* This lets administrators view detailed metrics on how long an engineer has worked and how many tasks they've completed.

---

## 4. Challenges Faced & How You Solved Them

### Challenge 1: Cross-Origin Cookie Sharing (CORS Issues)
* **The Problem:** During development, the React frontend ran on port `5173` and the Express backend ran on port `4000`. Due to the browser's Same-Origin Policy, the HttpOnly cookie containing the JWT was being blocked and not saved on the client side.
* **Your Solution:**
  1. Configured the backend CORS middleware to explicitly allow credentials:
     ```javascript
     app.use(cors({
         origin: 'http://localhost:5173',
         credentials: true
     }));
     ```
  2. Added `{ credentials: "include" }` or `withCredentials: true` to all Axios/Fetch requests on the frontend.
  3. Integrated `cookie-parser` on the backend so Express could read the cookies.

### Challenge 2: Keeping Auth State Persistent on Page Refresh
* **The Problem:** In React, memory state (`isloggin`, `role`, `user`) is wiped clean when the browser page is reloaded, redirecting logged-in users back to the login page.
* **Your Solution:**
  * Created a `/me` endpoint on the backend protected by `AdminAuth`.
  * Added a `useEffect` hook in the main `App.jsx` component that immediately runs a check-auth request to `/me` on page mount.
  * If the browser contains a valid HttpOnly cookie, the backend validates it, returns the user data, and updates React’s global state before rendering the dashboard pages.

### Challenge 3: Protecting Frontend Client-Side Routes
* **The Problem:** Even with backend route protection, users could still manually type URLs like `/coachprofile` or `/maintenance` in the browser and see the UI components (even if the data didn't load).
* **Your Solution:**
  * Developed a reusable `ProtectedRoute` wrapper component on the frontend.
  * It checks if `isloggin` is true. If not, it redirects the user back to the landing page (`/`) using `<Navigate replace />`, fully securing the client-side routes.

---

## 5. Potential Interview Questions to Prepare For

* **Q: Why did you use cookies instead of LocalStorage to store the JWT?**
  * *Answer:* LocalStorage is accessible via JavaScript. If an attacker successfully executes a Cross-Site Scripting (XSS) attack via a malicious third-party script, they can steal the JWT. By setting the cookie as `HttpOnly`, we instruct the browser that JavaScript cannot read the cookie, mitigating XSS theft.
* **Q: What is the benefit of stateless JWT authentication over session-based authentication?**
  * *Answer:* With stateless JWTs, the server doesn't need to store session IDs in memory or query a session database on every request. It simply verifies the signature of the incoming token, making the API highly scalable.
* **Q: How does the system handle database security?**
  * *Answer:* Database credentials are kept in a secure `.env` file that is never committed to GitHub. Furthermore, user passwords are never stored in plain text and are hashed using bcrypt with salt rounds before database insertion.
