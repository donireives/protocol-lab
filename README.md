# protocol-lab

Playground berbasis TypeScript untuk bereksperimen dengan berbagai protokol komunikasi. Tahap awal proyek ini menyediakan server Express sederhana untuk memahami pola HTTP CRUD, yang nantinya dapat diperluas ke WebSocket, gRPC, dan protokol lain.

## Fitur Saat Ini

- Server Express + TypeScript dengan arsitektur terstruktur (routes + middleware + controllers + services).
- Sample credential middleware menggunakan `x-api-key`.
- Dummy payload `dummy_product.json` yang digunakan untuk seluruh operasi GET/POST/PUT/DELETE.
- Rute health-check (`/health`) untuk memastikan server siap digunakan.
- Endpoint GraphQL (`/api/graphql`) berbasis `graphql-http` untuk mengambil daftar product via query tunggal.
- MCP server (`src/mcp/productServer.ts`) dengan tools `getProducts` dan `getTopSellerInsight` untuk client Model Context Protocol.

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

### Contoh HTTP (Postman / cURL)

| Field            | Nilai                                      |
|------------------|--------------------------------------------|
| Base URL         | `http://localhost:8000`                    |
| Health Check     | `GET /health`                              |
| Demo Prefix      | `/api/demo`                                |
| Auth Header      | `x-api-key: dev-protocol-key`              |
| Content-Type     | `application/json` (untuk POST/PUT/DELETE) |

**GET daftar produk**

- URL: `http://localhost:8000/api/demo/product`
- Method: `GET`
- Headers: `x-api-key: dev-protocol-key`

**POST simulasi produk**

- URL: `http://localhost:8000/api/demo/product`
- Method: `POST`
- Headers:
  - `x-api-key: dev-protocol-key`
  - `Content-Type: application/json`
- Body (raw JSON contoh):

```json
{
  "name": "Seagate Expansion 2TB",
  "price": 79.99,
  "active": true
}
```

**GraphQL**

- URL: `http://localhost:8000/api/graphql`
- Method: `POST`
- Headers:
  - `x-api-key: dev-protocol-key`
  - `Content-Type: application/json`
- Body:

```json
{
  "query": "{ products { id name price active } }"
}
```

Import konfigurasi di Postman dengan menambahkan environment variable `base_url = http://localhost:8000` dan header `x-api-key` tadi sehingga semua request mudah digandakan untuk tes lain.

## GraphQL

- Endpoint: `POST /api/graphql`
- Query utama: `products` mengembalikan array product.

Contoh query:

```bash
curl -X POST http://localhost:8000/api/graphql \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-protocol-key" \
  -d '{"query":"{ products { id name description price active } }"}'
```

Response akan sama dengan data dummy yang digunakan REST API.

## Model Context Protocol (MCP)

Server MCP sekarang tersedia dalam dua mode:

1. **HTTP (Streamable HTTP, cocok untuk Postman/Claude Code HTTP)** — otomatis aktif di aplikasi utama lewat endpoint `http://localhost:8000/mcp`.
2. **STDIO** — jalankan mandiri bila dibutuhkan (`npm run mcp:dev`).

Keduanya memanfaatkan dummy catalog (`src/data/dummy_product.json`) beserta insight produk paling laku (`src/data/top_seller_insight.json`). Tools yang tersedia:

- `getProducts` - mengembalikan daftar product dengan filter opsional `onlyActive`, `maxPrice`, dan `limit`.
- `getTopSellerInsight` - menampilkan insight penjualan serta opsi `includeProductDetail` agar data product ikut disertakan.

### Menjalankan MCP server

```bash
# Mode HTTP (default): jalankan aplikasi utama
npm run dev    # atau npm start setelah build

# Mode STDIO (opsional, untuk client CLI)
npm run mcp:dev          # TypeScript langsung
npm run build && npm run mcp   # dari dist/
```

Jika ingin menambahkan ke client MCP (Claude Code, VS Code MCP, Cursor, dsb), gunakan command `npm run mcp:dev` sebagai executable STDIO ketika mendaftarkan server tersebut.

### Endpoint MCP HTTP (Postman-friendly)

- URL: `http://localhost:8000/mcp`
- Method: `POST` (untuk JSON-RPC request), `GET` otomatis dipakai jika client membuka SSE stream
- Headers:
  - `Content-Type: application/json`
  - `x-api-key: dev-protocol-key`

#### 1. Initialize session

```json
{
  "jsonrpc": "2.0",
  "id": "init-1",
  "method": "initialize",
  "params": {
    "clientInfo": { "name": "postman", "version": "1.0.0" },
    "capabilities": {}
  }
}
```

#### 2. Daftar tools (opsional, untuk melihat nama)

```json
{
  "jsonrpc": "2.0",
  "id": "tools-1",
  "method": "tools/list",
  "params": {}
}
```

#### 3. Panggil tool `getProducts`

```json
{
  "jsonrpc": "2.0",
  "id": "call-1",
  "method": "tools/call",
  "params": {
    "name": "getProducts",
    "arguments": {
      "onlyActive": true,
      "limit": 2
    }
  }
}
```

Untuk tool `getTopSellerInsight`, ganti `name` menjadi `getTopSellerInsight` dan kirim `{"includeProductDetail": true}` bila ingin detail product ikut dikirim.

Di Postman, cukup buat satu request `POST http://localhost:8000/mcp`, set header `x-api-key` dan `Content-Type`, lalu kirim body JSON seperti contoh di atas.
