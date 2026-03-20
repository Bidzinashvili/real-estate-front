# Property API contract (backend reference)

> Source: Nest + class-validator DTOs + Prisma (no checked-in OpenAPI file). Runtime docs: **`GET /swagger`** on the API server (`SwaggerModule.setup('swagger', …)`).

## Auth

| Endpoint | Roles |
|----------|--------|
| `GET /properties` | Any authenticated user (`JwtAuthGuard`; no `@Roles` → `RolesGuard` allows). |
| `PATCH /properties/{id}` | `ADMIN` and `AGENT` (same DTO for both; no field-level role split in API). |

## `GET /properties`

- **200** — JSON array of `Property` rows with relations: `apartment`, `privateHouse`, `landPlot`, `commercial` (at most one block populated per row; others `null`).
- Ordered by `createdAt` descending.

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
