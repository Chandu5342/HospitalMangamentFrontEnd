# Hospital Management System Frontend

This is the frontend application for the Hospital Management System built with **React.js**.
It interacts with the backend API to manage patients, doctors, billing, lab reports, and admin functions.

---

## Features

* **Authentication**
  * Login and signup
  * JWT token stored in context/localStorage
  * Role-based navigation (admin, doctor, reception, lab)
* **Admin Module**
  * Manage users (add, edit, list, delete)
  * Search,filter lists,Pagination
  * View dashboard stats
* **Reception Module**
  * Add new patients
  * Assign doctors to patients
  * View patient list
  * Search,filter lists,Pagination
   * Create bills
  * View bills
  * Mark bills as paid
* **Doctor Module**
  * View assigned patients
  * Search,filter lists
  * Add treatment records
  * View patient history
  * Access lab results
* **Lab Module**

  * Uplood lab results
  * View lab records
* **Other Features**

  * Search,filter lists,Pagination


---

## Folder Structure

```
frontend/
│── public/
│── src/
│   ├── api/          # Axios API calls
│   ├── components/   # Reusable components (Navbar, ProtectedRoute)
│   ├── context/      # React Context for auth/state
│   ├── pages/        # Different pages (Admin, Doctor, Reception, Lab)
│   ├── routes/       # App routing
│   ├── App.jsx       # Main app component
│   └── index.jsx     # Entry point
│── package.json
```

---

## Tech Stack

* React.js
* React Router for routing
* Axios for API requests
* React Context for global state (auth)
* React-Bootstrap  for UI
* JWT-based authentication

---

## Available Pages / Modules

| Module    | Functionality                                             |
| --------- | --------------------------------------------------------- |
| Admin     | Add/edit/delete users, dashboard stats                    |
| Reception | Add patients, assign doctors, view patients               |
| Doctor    | View patients, add treatment, see history and lab results |
| Lab       | Upload lab results, view patient lab data                 |
| Billing   | Create and view bills, mark paid                          |

---
Live Link: https://hospital-mangament-front-end.vercel.app/login
## Connecting with Backend

* Update the API base URL in `.env`:

```env
VITE_API_URL=https://hospitalmangamentbackend.onrender.com
```

* Frontend expects the backend to expose the endpoints listed in the backend README.

---

## Run Locally

```bash
git clone https://github.com/Chandu5342/HospitalMangamentFrontEnd.git
cd frontend
npm install
npm run dev
```

* The app will run on: `http://localhost:5173` (or your Vite/CRA dev port)

---

## Test Accounts

Use the same credentials as backend:

| Role      | Email                                             | Password |
| --------- | ------------------------------------------------- | -------- |
| Admin     | [admin@gmail.com](mailto:admin@gmail.com)         | 123456   |
| Doctor    | [doctor@gmail.com](mailto:doctor1@gmail.com)     | 123456   |
| Reception | [reception@gmail.com](mailto:reception@gmail.com) | 123456   |
| lab | [lab@gmail.com](mailto:lab@gmail.com) | 123456   |
