# 🩺 Infokes Test

Proyek ini merupakan aplikasi web berbasis folder & file management (seperti Windows Explorer), dibangun dengan:

- 🌐 **Frontend**: Vue 3 (Vite)
- ⚙️ **Backend**: Bun + ElysiaJS + Prisma ORM
- 🗃️ **Database**: MariaDB / MySQL
- 📂 Fitur: Unlimited subfolder, upload file, CRUD folder & file

---

## 🗂️ Struktur Proyek
```
.
├── backend/ # ElysiaJS REST API (Bun)
├── frontend/ # Vue 3 (client)
└── README.md
```

## ⚙️ Persiapan

### 1. Clone repo

```bash
git clone https://github.com/halimkun/infokes-test.git
cd infokes-test
```

### 2. Setup `.env`
#### 🔧 Backend (ElysiaJS)
```
cd backend
cp .env.example .env
```
Edit .env untuk mengatur koneksi database dan port backend
#### 🎨 Frontend (Vue)
```
cd ../frontend
cp .env.example .env
```
Edit .env untuk menyesuaikan URL API backend

### 3. Install dependensi di masing-masing folder
#### 🔧 Backend (ElysiaJS)
```
cd backend
bun install
```
#### 🎨 Frontend (Vue)
```
cd ../frontend
npm install
```

### 4. Jalankan proyek
#### 🔧 Backend (ElysiaJS)
```
cd backend
bun run dev
```
#### 🎨 Frontend (Vue)
```
cd ../frontend
npm run dev
```

## ♻️ Test
Untuk menjalankan backeend test
```
cd backend
bun test
```
