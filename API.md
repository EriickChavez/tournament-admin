## Tournaments

| Servicio    | Método y ruta             | Params / Query / Body                   | Seguridad | Respuesta (éxito)                   |
| ----------- | ------------------------- | --------------------------------------- | --------- | ----------------------------------- |
| List public | `GET /tournaments/public` | **Query:** `page?`, `limit?`, `search?` | Público   | `200` `{ tournaments, pagination }` |

---

## Categories

| Servicio           | Método y ruta                               | Params / Query / Body      | Seguridad   | Respuesta (éxito)                       |
| ------------------ | ------------------------------------------- | -------------------------- | ----------- | --------------------------------------- |
| List by tournament | `GET /tournaments/:tournamentId/categories` | **Params:** `tournamentId` | **Público** | `200` `{ categories }` (sin paginación) |

---

## Teams

| Servicio           | Método y ruta                          | Params / Query / Body                                                                                              | Seguridad   | Respuesta (éxito)             |
| ------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------- | ----------------------------- |
| List by tournament | `GET /tournaments/:tournamentId/teams` | **Params:** `tournamentId`<br>**Query:** `page?` (default 1), `limit?` (default 20, max 100), `categoryId?` (uuid) | **Público** | `200` `{ teams, pagination }` |

**Ejemplos:**

```http
GET /tournaments/:tournamentId/teams
GET /tournaments/:tournamentId/teams?page=1&limit=20
GET /tournaments/:tournamentId/teams?categoryId=<uuid>
GET /tournaments/:tournamentId/teams?categoryId=<uuid>&page=1&limit=20
```

---

## Players

| Servicio           | Método y ruta                            | Params / Query / Body                                    | Seguridad   | Respuesta (éxito)               |
| ------------------ | ---------------------------------------- | -------------------------------------------------------- | ----------- | ------------------------------- |
| List by tournament | `GET /tournaments/:tournamentId/players` | **Params:** `tournamentId`. **Query:** `page?`, `limit?` | **Privado** | `200` `{ players, pagination }` |
| List by team       | `GET /teams/:teamId/players`             | **Params:** `teamId`. **Query:** `page?`, `limit?`       | **Público** | `200` `{ players, pagination }` |

---

## Matches

| Servicio            | Método y ruta                                   | Params / Query / Body                                                              | Seguridad   | Respuesta (éxito)                           |
| ------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------- | ----------- | ------------------------------------------- |
| List by tournament  | `GET /tournaments/:tournamentId/matches`        | **Params:** `tournamentId`. **Query:** `page?`, `limit?`, `categoryId?`, `status?` | **Público** | `200` `{ matches, pagination }`             |
| List public (alias) | `GET /tournaments/:tournamentId/matches/public` | Igual que arriba                                                                   | **Público** | Igual (misma lógica)                        |
| Get by id           | `GET /matches/:id`                              | **Params:** `id`                                                                   | **Público** | `200` `{ match }` (con equipos y categoría) |

---

## Match events

| Servicio      | Método y ruta                  | Params / Query / Body | Seguridad   | Respuesta (éxito)                   |
| ------------- | ------------------------------ | --------------------- | ----------- | ----------------------------------- |
| List by match | `GET /matches/:matchId/events` | **Params:** `matchId` | **Público** | `200` `{ events }` (sin paginación) |

---

## Standings

Base: `/tournaments/:tournamentId/categories/:categoryId`

| Servicio    | Método y ruta         | Params / Query / Body                    | Seguridad   | Respuesta (éxito)                               |
| ----------- | --------------------- | ---------------------------------------- | ----------- | ----------------------------------------------- |
| Standings   | `GET .../standings`   | **Params:** `tournamentId`, `categoryId` | **Público** | `200` — tabla (PJ, PG, PE, PP, GF, GC, DG, pts) |
| Top scorers | `GET .../top-scorers` | igual                                    | **Público** | `200` — ranking goles / asistencias             |
| Cards       | `GET .../cards`       | igual                                    | **Público** | `200` — ranking tarjetas                        |

No se editan a mano: se recalculan desde partidos `finished` + eventos.

---

**Con paginación:** tournaments public, teams, players (torneo y equipo), matches, members.

**Error (shape fijo):**

```json
{
  "error": {
    "code": "STRING_CODE",
    "message": "Texto legible",
    "details": []
  }
}
```
