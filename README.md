# ReadMeNetflix:
By Iarina Dicu and Sara Rodrigues Cardoso
---

## Prerequisites

1. **Node.js and npm**: Install the latest version of [Node.js](https://nodejs.org/) (includes npm).
2. **MySQL Server**: Install and set up MySQL on your machine. You can download it from [MySQL Downloads](https://dev.mysql.com/downloads/installer/).
3. **Git**: Install Git from [Git Downloads](https://git-scm.com/downloads).
4. **Frontend Framework/Library**: If the frontend is built using a specific framework (React, Angular, Vue), ensure the corresponding CLI is installed.
 
---

## Deployment Steps

### 1. Clone the Project Repository

1. Clone the repository from your version control system (e.g., GitHub):
   ```
   git clone <repository-url>
   cd <repository-folder>
   ```

---

### 2. Setting Up the Backend (API)

1. Navigate to the `src/API` folder:
   ```
   cd src/API
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the `src/API` directory to store environment variables:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=mydb
   JWT_SECRET=secretKey
   JWT_EXPIRY=1h
   ```
   Replace `DB_USER`, `DB_PASSWORD`, and `DB_NAME` with your MySQL credentials.

4. Import the database schema:
   - Open your MySQL client or workbench.
   - Run the SQL script provided in the `db/schema.sql` file to create and populate the database.

   ```
   mysql -u root -p mydb < db/schema.sql
   ```

5. Start the API server:
   ```
   npm start
   ```

   The backend will run on `http://localhost:3000`.

---

### 3. Setting Up the Database (MySQL)

1. Ensure MySQL is running on your system.
2. Use the credentials specified in the `.env` file to connect to the database.

   ```
   mysql -u root -p
   ```
---

### 4. Setting Up the Frontend

1. Navigate to the frontend folder:
   ```
   cd src/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

   The frontend will run on `http://localhost:3000`.

---

## Troubleshooting

1. **Database Connection Issues**:
   - Ensure MySQL service is running.
   - Verify `.env` credentials.

2. **Frontend Issues**:
   - Ensure `API_BASE_URL` points to the correct backend URL.

---
