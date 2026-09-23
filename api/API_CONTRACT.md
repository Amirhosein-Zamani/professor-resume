# API Contract

## Base URL

- Local API base URL: `http://localhost:4000/api`
- Swagger UI: `http://localhost:4000/api/docs`

## Authentication

- Auth uses a JWT stored in an HttpOnly cookie.
- Cookie name comes from `COOKIE_NAME`.
- Current expected cookie name: `professor_resume_token`
- Cookie behavior:
  - `httpOnly: true`
  - `sameSite: "lax"`
  - `secure: true` only in production
  - `path: /`
- Frontend requests that need the cookie must send credentials.

Example with `fetch`:

```ts
await fetch('http://localhost:4000/api/auth/me', {
  method: 'GET',
  credentials: 'include',
});
```

Example with Axios:

```ts
await axios.get('http://localhost:4000/api/auth/me', {
  withCredentials: true,
});
```

## Login Flow

1. Frontend submits credentials to `POST /auth/login` with `credentials: 'include'`.
2. API validates the user and sets the JWT cookie.
3. Frontend calls `GET /auth/me` with `credentials: 'include'` to load the session.
4. Frontend calls `POST /auth/logout` with `credentials: 'include'` to clear the cookie.

Login request example:

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "admin@example.com",
  "password": "YOUR_PASSWORD_HERE"
}
```

Login response:

```json
{
  "user": {
    "id": "clx1234567890abcdef123456",
    "email": "admin@example.com",
    "role": "ADMIN",
    "createdAt": "2026-06-21T10:30:00.000Z",
    "updatedAt": "2026-06-21T10:30:00.000Z"
  }
}
```

## Public Endpoints

### `GET /health`

Response:

```json
{
  "status": "ok",
  "service": "professor-resume-api",
  "timestamp": "2026-06-21T10:30:00.000Z"
}
```

### `GET /professors`

Returns the public professor list used by the frontend card/list UI.

Response:

```json
[
  {
    "id": "clxprofessor1234567890abcd",
    "slug": "reza-mortazavi",
    "name": "دکتر رضا مرتضوی",
    "displayName": "دکتر رضا مرتضوی",
    "firstName": "رضا",
    "lastName": "مرتضوی",
    "rank": "استادیار",
    "faculty": "مهندسی کامپیوتر",
    "specialty": "هوش مصنوعی و سیستم های نرم افزاری",
    "isFaculty": true,
    "avatar": "/Images/professors/reza-mortazavi.jpg",
    "email": "reza.mortazavi@example.com",
    "bio": "عضو هیئت علمی دانشکده مهندسی کامپیوتر.",
    "links": {
      "scholar": "https://scholar.google.com/citations?user=example",
      "researchgate": "https://www.researchgate.net/profile/Reza-Mortazavi",
      "scopus": "https://www.scopus.com/authid/detail.uri?authorId=12345678900",
      "website": "https://example.edu/faculty/reza-mortazavi"
    }
  }
]
```

Important frontend-visible list fields:

- `id`
- `slug`
- `displayName`
- `firstName`
- `lastName`
- `rank`
- `faculty`
- `specialty`
- `isFaculty`
- `avatar`
- `email`
- `links`

### `GET /professors/:idOrSlug`

Accepts either a professor database `id` or the public `slug`.

Response:

```json
{
  "id": "clxprofessor1234567890abcd",
  "slug": "reza-mortazavi",
  "name": "دکتر رضا مرتضوی",
  "displayName": "دکتر رضا مرتضوی",
  "firstName": "رضا",
  "lastName": "مرتضوی",
  "nationalCode": "0012345678",
  "rank": "استادیار",
  "faculty": "مهندسی کامپیوتر",
  "specialty": "هوش مصنوعی و سیستم های نرم افزاری",
  "isFaculty": true,
  "avatar": "/Images/professors/reza-mortazavi.jpg",
  "email": "reza.mortazavi@example.com",
  "cvUrl": "https://example.edu/cv/reza-mortazavi.pdf",
  "bio": "عضو هیئت علمی دانشکده مهندسی کامپیوتر با تمرکز بر هوش مصنوعی.",
  "golestanProfessorNo": "1304",
  "employeeNo": "EMP-1024",
  "studentNo": "STU-2048",
  "facultyName": "دانشکده مهندسی",
  "researchGroupName": "گروه هوش مصنوعی",
  "organizationName": "دانشگاه دامغان",
  "links": {
    "scholar": "https://scholar.google.com/citations?user=example",
    "researchgate": "https://www.researchgate.net/profile/Reza-Mortazavi",
    "scopus": "https://www.scopus.com/authid/detail.uri?authorId=12345678900",
    "website": "https://example.edu/faculty/reza-mortazavi"
  },
  "stats": {
    "theses": 2,
    "papers": 12,
    "conferences": 3,
    "books": 1
  },
  "publications": [
    {
      "id": "clxpublication1234567890abc",
      "title": "Machine Learning Applications in Higher Education",
      "journal": "Journal of Educational Technology",
      "year": 2025,
      "authors": "Reza Mortazavi; Coauthor Example",
      "doi": "10.1000/example-doi",
      "golestanArticleNo": "1304-77",
      "printPlace": "Tehran",
      "language": "fa",
      "journalArticleType": "Journal Article",
      "latinJournalOrConfTitle": "International Conference on AI in Education",
      "persianJournalOrConfTitle": "کنفرانس هوش مصنوعی در آموزش",
      "activityRegisteredAt": "2025-11-20T08:00:00.000Z"
    }
  ],
  "activities": [
    {
      "id": "clxactivity1234567890abcdef",
      "sourceId": "golestan-activity-42",
      "type": "مقاله علمی",
      "titleFa": "طراحی سامانه های هوشمند در آموزش",
      "titleEn": "Intelligent Systems Design in Education",
      "description": "A peer-reviewed journal article.",
      "date": "2024-09-01T00:00:00.000Z",
      "sortOrder": 0,
      "createdAt": "2026-06-21T10:30:00.000Z",
      "updatedAt": "2026-06-21T10:30:00.000Z"
    }
  ],
  "createdAt": "2026-06-21T10:30:00.000Z",
  "updatedAt": "2026-06-21T10:30:00.000Z"
}
```

Important frontend-visible detail fields:

- `id`
- `slug`
- `firstName`
- `lastName`
- `displayName`
- `nationalCode`
- `rank`
- `faculty`
- `specialty`
- `isFaculty`
- `avatar`
- `email`
- `cvUrl`
- `bio`
- `links`
- `activities`
- `publications`

### `GET /professors/:idOrSlug/activities`

Response:

```json
{
  "professorId": "clxprofessor1234567890abcd",
  "slug": "reza-mortazavi",
  "displayName": "دکتر رضا مرتضوی",
  "activities": [
    {
      "id": "clxactivity1234567890abcdef",
      "sourceId": "golestan-activity-42",
      "type": "مقاله علمی",
      "titleFa": "طراحی سامانه های هوشمند در آموزش",
      "titleEn": "Intelligent Systems Design in Education",
      "description": "A peer-reviewed journal article.",
      "date": "2024-09-01T00:00:00.000Z",
      "sortOrder": 0,
      "createdAt": "2026-06-21T10:30:00.000Z",
      "updatedAt": "2026-06-21T10:30:00.000Z"
    }
  ]
}
```

Activity item fields:

- `id`
- `sourceId`
- `type`
- `titleFa`
- `titleEn`
- `description`
- `date`
- `sortOrder`

## Protected Endpoints

All protected routes require the auth cookie and must be called with credentials included.

### `POST /auth/login`

Request body:

```json
{
  "email": "admin@example.com",
  "password": "YOUR_PASSWORD_HERE"
}
```

Response:

```json
{
  "user": {
    "id": "clx1234567890abcdef123456",
    "email": "admin@example.com",
    "role": "ADMIN",
    "createdAt": "2026-06-21T10:30:00.000Z",
    "updatedAt": "2026-06-21T10:30:00.000Z"
  }
}
```

### `POST /auth/logout`

Response:

```json
{
  "success": true
}
```

### `GET /auth/me`

Response:

```json
{
  "user": {
    "id": "clx1234567890abcdef123456",
    "email": "admin@example.com",
    "role": "ADMIN",
    "createdAt": "2026-06-21T10:30:00.000Z",
    "updatedAt": "2026-06-21T10:30:00.000Z"
  }
}
```

### `POST /professors`

Request body:

```json
{
  "slug": "reza-mortazavi",
  "firstName": "رضا",
  "lastName": "مرتضوی",
  "displayName": "دکتر رضا مرتضوی",
  "nationalCode": "0012345678",
  "rank": "استادیار",
  "faculty": "مهندسی کامپیوتر",
  "specialty": "هوش مصنوعی و سیستم های نرم افزاری",
  "isFaculty": true,
  "avatar": "/Images/professors/reza-mortazavi.jpg",
  "email": "reza.mortazavi@example.com",
  "cvUrl": "https://example.edu/cv/reza-mortazavi.pdf",
  "bio": "عضو هیئت علمی دانشکده مهندسی کامپیوتر با تمرکز بر هوش مصنوعی.",
  "golestanProfessorNo": "1304",
  "employeeNo": "EMP-1024",
  "studentNo": "STU-2048",
  "facultyName": "دانشکده مهندسی",
  "researchGroupName": "گروه هوش مصنوعی",
  "organizationName": "دانشگاه دامغان",
  "links": {
    "scholar": "https://scholar.google.com/citations?user=example",
    "researchgate": "https://www.researchgate.net/profile/Reza-Mortazavi",
    "scopus": "https://www.scopus.com/authid/detail.uri?authorId=12345678900",
    "website": "https://example.edu/faculty/reza-mortazavi"
  }
}
```

Response: same shape as `GET /professors/:idOrSlug`

### `PATCH /professors/:id`

Request body:

```json
{
  "displayName": "دکتر رضا مرتضوی",
  "specialty": "یادگیری ماشین",
  "bio": "Updated biography text.",
  "links": {
    "website": "https://example.edu/faculty/reza-mortazavi"
  }
}
```

Response: same shape as `GET /professors/:idOrSlug`

### `DELETE /professors/:id`

Response:

```json
{
  "success": true
}
```

### `POST /professors/:id/activities`

Request body:

```json
{
  "sourceId": "manual-activity-1",
  "type": "مقاله علمی",
  "titleFa": "طراحی سامانه های هوشمند در آموزش",
  "titleEn": "Intelligent Systems Design in Education",
  "description": "A peer-reviewed journal article.",
  "date": "2024-09-01T00:00:00.000Z",
  "sortOrder": 0
}
```

Response:

```json
{
  "id": "clxactivity1234567890abcdef",
  "sourceId": "manual-activity-1",
  "type": "مقاله علمی",
  "titleFa": "طراحی سامانه های هوشمند در آموزش",
  "titleEn": "Intelligent Systems Design in Education",
  "description": "A peer-reviewed journal article.",
  "date": "2024-09-01T00:00:00.000Z",
  "sortOrder": 0,
  "createdAt": "2026-06-21T10:30:00.000Z",
  "updatedAt": "2026-06-21T10:30:00.000Z"
}
```

### `PATCH /professors/:id/activities/:activityId`

Request body:

```json
{
  "titleFa": "عنوان به روز شده",
  "sortOrder": 1
}
```

Response: same shape as the activity object above.

### `DELETE /professors/:id/activities/:activityId`

Response:

```json
{
  "success": true
}
```

### `PUT /professors/:id/links`

Request body:

```json
{
  "scholar": "https://scholar.google.com/citations?user=example",
  "researchgate": "https://www.researchgate.net/profile/Reza-Mortazavi",
  "scopus": "https://www.scopus.com/authid/detail.uri?authorId=12345678900",
  "website": "https://example.edu/faculty/reza-mortazavi"
}
```

Response:

```json
{
  "scholar": "https://scholar.google.com/citations?user=example",
  "researchgate": "https://www.researchgate.net/profile/Reza-Mortazavi",
  "scopus": "https://www.scopus.com/authid/detail.uri?authorId=12345678900",
  "website": "https://example.edu/faculty/reza-mortazavi"
}
```

## Frontend Calling Rules

- Always use `credentials: 'include'` for auth-sensitive requests.
- Public reads can also use `credentials: 'include'`; it is harmless and keeps one client configuration.
- Treat `slug` as the public route identifier for professor pages.
- `idOrSlug` endpoints accept either value, so the frontend can safely use `slug`.
- The API never returns `passwordHash`.
