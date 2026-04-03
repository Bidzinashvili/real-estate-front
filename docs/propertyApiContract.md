# Property API contract (backend reference)

> Source: Nest + class-validator DTOs + Prisma (no checked-in OpenAPI file). Runtime docs: **`GET /swagger`** on the API server (`SwaggerModule.setup('swagger', …)`).

## Auth

| Endpoint | Roles |
|----------|--------|
| `GET /properties` | Any authenticated user (`JwtAuthGuard`; no `@Roles` → `RolesGuard` allows). |
| `PATCH /properties/{id}` | `ADMIN` and `AGENT` (same DTO for both; no field-level role split in API). |

## `GET /properties`

- **200** — The API historically returned a **JSON array** of `Property` rows with relations: `apartment`, `privateHouse`, `landPlot`, `commercial` (at most one block populated per row; others `null`), ordered by `createdAt` descending.
- **Frontend normalization (this repo):** [`normalizePropertiesListResponse`](../src/features/properties/normalizers.ts) accepts **either** a raw **`Property[]` array** **or** an object envelope with at least `properties: Property[]` plus optional `total`, `page`, and `limit`. If the body is an array, the client treats it as a single page (`page: 1`, `total` and `limit` derived from the array length).

### Query parameters the SPA may send

The catalog and [`toGetPropertiesSearchParams`](../src/features/properties/getPropertiesQuery.ts) may append:

`search`, `type` (property type enum; not `propertyType`), `dealType`, `city`, `district`, `minPrice`, `maxPrice`, `rooms`, `bedrooms`, `minArea`, `maxArea`, `floor`, `yardArea`, `houseArea`, `landArea`, `area` (commercial area), `sortBy` (`createdAt` | `pricePublic`), `order` (`asc` | `desc`), `page`, `limit`.

**Verify on `GET /swagger`:** whether these names and semantics are implemented server-side. If the server ignores them or always returns the full array, list pagination and filters in the UI may not match server behavior or may download very large payloads per request.

### Enums (relevant)

- **DealType:** `SALE` | `RENT` | `DAILY_RENT`
- **PropertyType:** `APARTMENT` | `PRIVATE_HOUSE` | `LAND_PLOT` | `COMMERCIAL` | `COTTAGE` | `HOTEL`

## `PATCH /properties/{id}`

- **Body:** Only fields on **`UpdatePropertyDto`** (+ nested DTOs). `ValidationPipe` uses **`whitelist: true`** — unknown keys are stripped.
- **Response:** **200** with the **updated `Property` row** (Prisma `update` without `include` — flat scalars on the property table, not nested relations in that return).
- All PATCH fields are optional; partial updates are intended.

### Allowed root fields (`UpdatePropertyDto`)

| Field | Type |
|-------|------|
| `dealType` | `DealType` enum |
| `city`, `district`, `address` | string |
| `pricePublic`, `priceInternal` | number (`priceInternal` optional in DB) |
| `description` | string |

### Nested blocks (send only the block that matches the listing)

| Block | Fields | Types |
|-------|--------|--------|
| `apartment` | `totalArea`, `rooms`, `balcony`, `floor` | number, number, boolean, number |
| `privateHouse` | `houseArea`, `yardArea`, `pool`, `fruitTrees` | number, number, boolean, boolean |
| `landPlot` | `landArea`, `forInvestment`, `canBeDivided` | number, boolean, boolean |
| `commercial` | `area`, `parking`, `airConditioner` | number, boolean, boolean |

This is the **full** set the API accepts today; extending PATCH means extending DTOs + service logic.

## Editable vs read-only (summary)

**Not on `UpdatePropertyDto` (not editable via this PATCH):**  
`propertyType`, `cadastralCode`, owner fields, external IDs (`ourSiteId`, `myHomeId`, `ssGeId`), `comment`, `internalComment`, `reminderDate`, `commentDate`, `images`, `userId`, `createdAt`, `updatedAt`, and any nested fields beyond the table above (e.g. apartment `buildingNumber`, `bedrooms`, `elevator`, …).

**Timestamps:** Managed by Prisma; not in PATCH DTO.

## Frontend alignment

This repo’s **editable fields** and **PATCH payload** types are intended to match **`UpdatePropertyDto`** + nested update DTOs. Read-only sections in the UI correspond to GET-only fields until the backend extends PATCH.

### Optional backend improvement

If generated OpenAPI should list nested PATCH models fully, add `@ApiExtraModels` / `@ApiBody` for **`UpdatePropertyDto`** (create DTOs are already wired in the controller in some places).

## Future API: server-driven list (proposed)

For larger datasets the backend should implement server-side filtering, sorting, and pagination and return a stable envelope (`properties` + `total` + `page` + `limit`, or a documented `items` key) so the UI’s page controls match server truth.

Until **`GET /swagger`** documents and implements that behavior, treat array-only responses and ignored query params as a known limitation and validate behavior against the live API.

### Backend checklist (confirm against Swagger)

1. Response shape: raw array only, or envelope with which keys (`properties`, `items`, `total`, `page`, `limit`)?
2. Which of the query keys above are accepted and how are unknown params treated?
3. Is `total` the count of all matching rows across pages?
4. `PATCH /properties/:id`: response body is flat scalars without nested relations — ensure the frontend does not assume nested `apartment` / `privateHouse` / etc. in the PATCH JSON response when wiring any parser.
