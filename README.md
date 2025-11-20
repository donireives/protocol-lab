# protocol-lab

Playground berbasis TypeScript untuk bereksperimen dengan berbagai protokol komunikasi. Tahap awal proyek ini menyediakan server Express sederhana untuk memahami pola HTTP CRUD, yang nantinya dapat diperluas ke WebSocket, gRPC, dan protokol lain.

## Fitur Saat Ini

- Server Express + TypeScript dengan arsitektur terstruktur (routes → middleware → controllers → services).
- Sample credential middleware menggunakan `x-api-key`.
- Dummy payload `dummy_product.json` yang digunakan untuk seluruh operasi GET/POST/PUT/DELETE.
- Rute health-check (`/health`) untuk memastikan server siap digunakan.
- Endpoint GraphQL (`/api/graphql`) berbasis `graphql-http` untuk mengambil daftar product via query tunggal.

## Struktur Proyek

```
src/
  app.ts
  server.ts
  config/env.ts
  data/dummy_product.json
  middleware/apiKeyMiddleware.ts
  routes/{index,productRoutes}.ts
  controllers/productController.ts
  services/productService.ts
  types/product.ts
  graphql/{schema,resolvers}.ts
```

## Persiapan

1. Pastikan Node.js 18+ terinstal.
2. Install dependencies:
   ```bash
   npm install
   ```

## Perintah Penting

- Jalankan dalam mode pengembangan (hot reload):
  ```bash
  npm run dev
  ```
- Build TypeScript ke JavaScript:
  ```bash
  npm run build
  ```
- Jalankan build hasil kompilasi:
  ```bash
  npm start
  ```

## Konfigurasi

Nilai environment dapat diset melalui file `.env` (opsional):

```
PORT=8000
API_KEY=dev-protocol-key
```

Jika tidak di-set, server akan default ke port `8000` dan API key `dev-protocol-key`.

## API Demo

Seluruh endpoint berada di bawah prefix `/api/demo` dan membutuhkan header `x-api-key`.

| Method | Endpoint                 | Deskripsi                                                                 |
|--------|--------------------------|---------------------------------------------------------------------------|
| GET    | `/api/demo/product`      | Mengembalikan daftar dummy product.                                      |
| POST   | `/api/demo/product`      | Menerima payload lalu mengembalikan pesan bahwa operasi hanya simulasi. |
| PUT    | `/api/demo/product`      | Menirukan update data tanpa menyentuh sumber sebenarnya.                |
| DELETE | `/api/demo/product`      | Menirukan penghapusan tanpa mengubah file JSON.                         |

Contoh request:

```bash
curl -X GET http://localhost:8000/api/demo/product \
  -H "x-api-key: dev-protocol-key"
```

Walau operasi POST/PUT/DELETE menerima payload JSON, dummy file tidak pernah berubah, sehingga aman untuk pengujian berulang.

## GraphQL

- Endpoint: `POST /api/graphql`
- Query utama: `products` mengembalikan array product.
- GraphiQL: otomatis aktif bila `NODE_ENV !== production`.

Contoh query:

```bash
curl -X POST http://localhost:8000/api/graphql \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-protocol-key" \
  -d '{"query":"{ products { id name description price active } }"}'
```

Response akan sama dengan data dummy yang digunakan REST API.
