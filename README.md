# PMS MVP Monorepo

This repository contains a Turborepo with frontend (Next.js) and backend (Express/TypeScript). It includes Firebase-based storage today and optional Amazon RDS PostgreSQL setup.

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Install dependencies for all Apps

`npm install -w`
or
`yarn install -w`

### Build

To build all apps and packages, run the following command:

```
cd pms-mvp-monorepo
yarn build
```

### Develop

To develop all apps and packages, run the following command:

```
cd pms-mvp-monorepo
yarn dev
```

===== Answers of Part 4: Firestore Query for Ranking & Active Status Update Strategy =====

1. Problem: Multi-Factor Ranking with Pagination 
   We need a query to rank users efficiently based on:
   - Total Average Weight Ratings (Highest Priority)
   - Number of Rents
   - Recently Active Time
2. Solution: Precompute a Ranking Score
   To rank users correctly, we calculate a ranking score before querying
   Formula for rankingScore:
   `(totalAverageWeightRatings * 1000) + (numberOfRents * 10) + (recentlyActive / 1_000_000);`
3. Explanation:
   Multiplying `totalAverageWeightRatings` by 1000 ensures it has the highest priority.
   Multiplying `numberOfRents` by 10 makes it secondary.
   Dividing `recentlyActive` by 1,000,000 ensures it contributes without overpowering the first two factors.
4. Firestore Query with Pagination
   4.1. Firestore Query with Pagination
   ```
   import { db } from "../config/firebaseConfig";
   export const fetchRankedUsers = async (lastDoc: any = null, limit: number = 10) => {
       let query = db.collection("USERS").orderBy("rankingScore", "desc").limit(limit);

       if (lastDoc) {
          query = query.startAfter(lastDoc);
       }

       const snapshot = await query.get();
       return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
   };
   ```
   4.2. Keep `recentlyActive` Updated Automatically
        Users' `recentlyActive` field should be updated whenever they perform an action.
        Firestore Trigger to Update `recentlyActive` & `rankingScore`, use Firebase Cloud Function to update recentlyActive when users interact.

================  Answer Part 5: Personality & Technical Questions ================ 

1️⃣ **Most Difficult Technical Problems & Solutions**
   - Problem: Develop the large-scale application, ensure it can be easy to maintain, extend and upgrade/migrate the new lib version or new platform/technologies.
   - Issue:
     + Libs have some deprecated features cause or conflicts between frameworks and libs when we upgrade to new version. Ex: upgrade from Next 13/14 to Next 15.
     + Migrate from Google Cloud to AWS takes much time
     + Source code comes larger and must migrate to mono-repo, apply the microservice architecture. => It's the big challenge when 
   - Fix: I divide to smaller step, make the plan to do:
     + What features/modules can be migrated/upgraded first
     + How many efforts to make things done
     + What risks and are there any chance to roll back the changes
     + ....

2️⃣ **When you’re working on a project, how do you typically approach it from start to finish**
✅ Step 1: Analyze the requirement, define the project scope, make the plan => We can't do anything we don't understand why, what we will do and when we start and finish.
✅ Step 2: Design the architecture, choose suitable technologies => Next step is define how to do. This step ensures the performance, scaling and maintain capability 
✅ Step 3: Design UI/UX (if we own the project or this phase of project)
✅ Step 4: Implementation => Should follow the coding convention, development model/process (Ex: Agile), including the self test, unit test...
✅ Step 5: Testing & Optimization.
✅ Step 6: Deployment & Monitoring

3️⃣ How I Learn New Topics Efficiently
   - Start with WHY. Why I need to learn it, it can solve which problem in real life/work
   - Read the official documents with the topics related to the problem
   - Create the simulator, practice environment to learn by practice
   - Research from online communities/forums or AI tools
   - Follow Experts – Read blog posts and GitHub repositories
   - Ask for reviewing the learning result by seniors or experts (if I know them)
   - 
4️⃣ "Consistency" vs "Fast & Efficient"
    - The best answer is "Consistency", long-term stability is more important than speed.
    But sometimes we have to choose Fast & Efficient, it depends on the most importance at the current development phase.
    We can make a short-term plan beside the long-term one for a purpose like demo or something. Then take some time to refactor the code.

5️⃣ Do I Own Any Apple Products?
   - Yes, I have iPhone 11 and iPad Gen 8

6️⃣ Immediate Availability to Start
   - I'm Ready to start immediately

# PMS MVP Monorepo

This repository contains a Turborepo with frontend (Next.js) and backend (Express/TypeScript). It includes Firebase-based storage today and optional Amazon RDS PostgreSQL setup.

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Install dependencies for all Apps

`npm install -w`
or
`yarn install -w`

### Build

To build all apps and packages, run the following command:

```
cd pms-mvp-monorepo
yarn build
```

### Develop

To develop all apps and packages, run the following command:

```
cd pms-mvp-monorepo
yarn dev
```

## Backend: File Storage (Local or AWS S3)

The backend supports two storage providers for attachments:

- local (default): files are saved under apps/backend/uploads and served via /uploads/*.
- s3: files are uploaded to an AWS S3 bucket.

Configure the provider via environment variables in apps/backend/.env:

Required for both:
- FILE_STORAGE_PROVIDER=local | s3

If FILE_STORAGE_PROVIDER=s3, also set:
- AWS_REGION=ap-southeast-1 (example)
- AWS_ACCESS_KEY_ID=... (optional if running on an AWS role)
- AWS_SECRET_ACCESS_KEY=... (optional if running on an AWS role)
- S3_BUCKET=your-bucket-name
- S3_PUBLIC_URL_BASE=https://your-bucket.s3.amazonaws.com (optional; if omitted, the API will construct https://S3_BUCKET.s3.AWS_REGION.amazonaws.com/<key>)

API endpoints:
- POST /api/tasks/:taskId/attachments with multipart/form-data field file to upload.
- GET  /api/tasks/:taskId/attachments to list attachments for a task.
- DELETE /api/attachments/:id to delete an attachment (removes from storage and database).

Notes:
- When using S3, the original filename is normalized and prefixed with a timestamp to form the S3 object key stored in the database.
- The TaskAttachment.url will be a public URL only if your bucket or CDN allows public access for objects; otherwise it may be null.


===== Answers of Part 4: Firestore Query for Ranking & Active Status Update Strategy =====

1. Problem: Multi-Factor Ranking with Pagination 
   We need a query to rank users efficiently based on:
   - Total Average Weight Ratings (Highest Priority)
   - Number of Rents
   - Recently Active Time
2. Solution: Precompute a Ranking Score
   To rank users correctly, we calculate a ranking score before querying
   Formula for rankingScore:
   `(totalAverageWeightRatings * 1000) + (numberOfRents * 10) + (recentlyActive / 1_000_000);`
3. Explanation:
   Multiplying `totalAverageWeightRatings` by 1000 ensures it has the highest priority.
   Multiplying `numberOfRents` by 10 makes it secondary.
   Dividing `recentlyActive` by 1,000,000 ensures it contributes without overpowering the first two factors.
4. Firestore Query with Pagination
   4.1. Firestore Query with Pagination
   ```
   import { db } from "../config/firebaseConfig";
   export const fetchRankedUsers = async (lastDoc: any = null, limit: number = 10) => {
       let query = db.collection("USERS").orderBy("rankingScore", "desc").limit(limit);

       if (lastDoc) {
          query = query.startAfter(lastDoc);
       }

       const snapshot = await query.get();
       return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
   };
   ```
   4.2. Keep `recentlyActive` Updated Automatically
        Users' `recentlyActive` field should be updated whenever they perform an action.
        Firestore Trigger to Update `recentlyActive` & `rankingScore`, use Firebase Cloud Function to update recentlyActive when users interact.

================  Answer Part 5: Personality & Technical Questions ================ 

1️⃣ **Most Difficult Technical Problems & Solutions**
   - Problem: Develop the large-scale application, ensure it can be easy to maintain, extend and upgrade/migrate the new lib version or new platform/technologies.
   - Issue:
     + Libs have some deprecated features cause or conflicts between frameworks and libs when we upgrade to new version. Ex: upgrade from Next 13/14 to Next 15.
     + Migrate from Google Cloud to AWS takes much time
     + Source code comes larger and must migrate to mono-repo, apply the microservice architecture. => It's the big challenge when 
   - Fix: I divide to smaller step, make the plan to do:
     + What features/modules can be migrated/upgraded first
     + How many efforts to make things done
     + What risks and are there any chance to roll back the changes
     + ....

2️⃣ **When you’re working on a project, how do you typically approach it from start to finish**
✅ Step 1: Analyze the requirement, define the project scope, make the plan => We can't do anything we don't understand why, what we will do and when we start and finish.
✅ Step 2: Design the architecture, choose suitable technologies => Next step is define how to do. This step ensures the performance, scaling and maintain capability 
✅ Step 3: Design UI/UX (if we own the project or this phase of project)
✅ Step 4: Implementation => Should follow the coding convention, development model/process (Ex: Agile), including the self test, unit test...
✅ Step 5: Testing & Optimization.
✅ Step 6: Deployment & Monitoring

3️⃣ How I Learn New Topics Efficiently
   - Start with WHY. Why I need to learn it, it can solve which problem in real life/work
   - Read the official documents with the topics related to the problem
   - Create the simulator, practice environment to learn by practice
   - Research from online communities/forums or AI tools
   - Follow Experts – Read blog posts and GitHub repositories
   - Ask for reviewing the learning result by seniors or experts (if I know them)
   - 
4️⃣ "Consistency" vs "Fast & Efficient"
    - The best answer is "Consistency", long-term stability is more important than speed.
    But sometimes we have to choose Fast & Efficient, it depends on the most importance at the current development phase.
    We can make a short-term plan beside the long-term one for a purpose like demo or something. Then take some time to refactor the code.

5️⃣ Do I Own Any Apple Products?
   - Yes, I have iPhone 11 and iPad Gen 8

6️⃣ Immediate Availability to Start
   - I'm Ready to start immediately


## Backend: Notifications and Activity Logs

The backend now exposes endpoints for user notifications and activity logs with basic sorting and filtering.

Database schema:
- Table activity_logs already exists in apps/backend/db/pms.sql
- Table notifications added to apps/backend/db/pms.sql
  - Run: yarn build && (cd apps/backend && node ./dist/utils/run-sql.js apps/backend/db/pms.sql)

Auth: All routes below require authMiddleware (same as other /api routes).

Activity endpoints:
- GET /api/activity
  - Query params (all optional):
    - limit (1..100, default 20)
    - before (ISO string)
    - workspaceId, projectId, taskId
    - action, actorId
    - from, to (ISO strings)
    - order=asc|desc (default desc)
- GET /api/tasks/:taskId/activity
  - Same query params as above, taskId fixed from path

Notifications endpoints:
- GET /api/notifications
  - Query params: limit, before, unreadOnly=true|false, type, entityType, order=asc|desc
  - Returns notifications for current user (req.userId)
- POST /api/notifications
  - Body: { userId, type, title?, body?, entityType?, entityId?, meta? }
  - Creates a notification (for system/admin or other server-side triggers)
- POST /api/notifications/:id/read
  - Marks one notification as read (only for current user)
- POST /api/notifications/read-all
  - Marks all current user's notifications as read

Notes:
- This is a minimal MVP. Domain services (e.g., task assignment, mentions) should call POST /api/notifications or directly use the repository to emit notifications when relevant events occur.
- Activity logs can be filtered and sorted by common fields; extend as needed.


## Backend: Project Management

Relationships
- A Workspace groups users and projects. Users join a workspace via workspace_members.
- A Project belongs to exactly one Workspace (projects.workspace_id).
- A Task belongs to exactly one Project (tasks.project_id) and one Board/Column within that project.

Routes (all require authMiddleware and live under /api):
- GET  /api/workspaces/:workspaceId/projects?q=&limit=&before=&order=asc|desc
- POST /api/workspaces/:workspaceId/projects
  - Body: { name, description? }
- GET  /api/projects/:id
- PATCH /api/projects/:id
  - Body: any subset of { name, description }
- DELETE /api/projects/:id

Notes:
- Activity logs are emitted on create/update/delete (activity_logs table) with workspaceId and projectId.
- Tasks already belong to projects; you can manage tasks under /api/projects/:projectId/tasks.

## Backend: Task Management

The backend now includes minimal task management APIs (CRUD, listing and assignees) built on the existing PostgreSQL schema (tasks, task_assignees).

Routes (all require authMiddleware and live under /api):
- POST /api/projects/:projectId/tasks
  - Body: { boardId, columnId?, title, description?, status?, priority?, dueDate? }
- GET  /api/projects/:projectId/tasks?boardId=&columnId=&status=&q=&assigneeId=&limit=&before=&order=asc|desc
- GET  /api/tasks/:id
- PATCH /api/tasks/:id
  - Body: any subset of { title, description, status, priority, dueDate, boardId, columnId }
- DELETE /api/tasks/:id
- GET  /api/tasks/:id/assignees
- POST /api/tasks/:id/assignees
  - Body: { userId }
- DELETE /api/tasks/:id/assignees/:userId
- GET  /api/tasks/:taskId/comments?limit=&before=&order=asc|desc

Notes:
- You can add attachments when creating or updating a task by sending multipart/form-data and including one or more files under the field name "files" (or a single file under "file"). The create (POST /api/projects/:projectId/tasks) and update (PATCH /api/tasks/:id) endpoints accept files and will upload them to the configured storage (local or S3) and link them to the task.
- Activity logs are emitted on create/update/delete/assign/unassign (activity_logs table).
- A notification is emitted to the assigned user on assignment (notifications table), if assignee != actor.
- Attachments endpoints already exist under /api/tasks/:taskId/attachments.
- Comments listing endpoint lets clients paginate and sort by created_at; default order is desc.
- Task status enum: 0=to do, 1=in progress, 2=in review, 3=done, 4=closed, 5=on hold. You may pass either the numeric code or the name (e.g., "in progress"); API normalizes to the number.


## Backend: Workspace/Project Switching

To support quick switching between places you worked recently, the backend exposes endpoints to list recent workspaces and projects for the current user, as well as all projects accessible to the user across their workspaces.

Routes (all require authMiddleware and live under /api/me):
- GET /api/me/recent/workspaces?limit=10
  - Returns the most recently active workspaces for the current user, inferred from activity logs. Each item includes lastActivityAt.
- GET /api/me/recent/projects?limit=10
  - Returns the most recently active projects for the current user, inferred from activity logs. Each item includes lastActivityAt.
- GET /api/me/projects?q=&limit=&before=&order=asc|desc
  - Lists all projects the current user can access (member of the corresponding workspace), optionally filtered by q.

Notes:
- Recent lists are derived from activity_logs by grouping on workspace_id/project_id for the current user (actor_id).
- No schema changes are required; this is a lightweight MVP to enable client-side workspace/project switchers.

# PMS MVP Monorepo

This repository contains a Turborepo with frontend (Next.js) and backend (Express/TypeScript). It includes Firebase-based storage today and optional Amazon RDS PostgreSQL setup.

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Install dependencies for all Apps

`npm install -w`
or
`yarn install -w`

### Build

To build all apps and packages, run the following command:

```
cd pms-mvp-monorepo
yarn build
```

### Develop

To develop all apps and packages, run the following command:

```
cd pms-mvp-monorepo
yarn dev
```

===== Answers of Part 4: Firestore Query for Ranking & Active Status Update Strategy =====

1. Problem: Multi-Factor Ranking with Pagination 
   We need a query to rank users efficiently based on:
   - Total Average Weight Ratings (Highest Priority)
   - Number of Rents
   - Recently Active Time
2. Solution: Precompute a Ranking Score
   To rank users correctly, we calculate a ranking score before querying
   Formula for rankingScore:
   `(totalAverageWeightRatings * 1000) + (numberOfRents * 10) + (recentlyActive / 1_000_000);`
3. Explanation:
   Multiplying `totalAverageWeightRatings` by 1000 ensures it has the highest priority.
   Multiplying `numberOfRents` by 10 makes it secondary.
   Dividing `recentlyActive` by 1,000,000 ensures it contributes without overpowering the first two factors.
4. Firestore Query with Pagination
   4.1. Firestore Query with Pagination
   ```
   import { db } from "../config/firebaseConfig";
   export const fetchRankedUsers = async (lastDoc: any = null, limit: number = 10) => {
       let query = db.collection("USERS").orderBy("rankingScore", "desc").limit(limit);

       if (lastDoc) {
          query = query.startAfter(lastDoc);
       }

       const snapshot = await query.get();
       return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
   };
   ```
   4.2. Keep `recentlyActive` Updated Automatically
        Users' `recentlyActive` field should be updated whenever they perform an action.
        Firestore Trigger to Update `recentlyActive` & `rankingScore`, use Firebase Cloud Function to update recentlyActive when users interact.

================  Answer Part 5: Personality & Technical Questions ================ 

1️⃣ **Most Difficult Technical Problems & Solutions**
   - Problem: Develop the large-scale application, ensure it can be easy to maintain, extend and upgrade/migrate the new lib version or new platform/technologies.
   - Issue:
     + Libs have some deprecated features cause or conflicts between frameworks and libs when we upgrade to new version. Ex: upgrade from Next 13/14 to Next 15.
     + Migrate from Google Cloud to AWS takes much time
     + Source code comes larger and must migrate to mono-repo, apply the microservice architecture. => It's the big challenge when 
   - Fix: I divide to smaller step, make the plan to do:
     + What features/modules can be migrated/upgraded first
     + How many efforts to make things done
     + What risks and are there any chance to roll back the changes
     + ....

2️⃣ **When you’re working on a project, how do you typically approach it from start to finish**
✅ Step 1: Analyze the requirement, define the project scope, make the plan => We can't do anything we don't understand why, what we will do and when we start and finish.
✅ Step 2: Design the architecture, choose suitable technologies => Next step is define how to do. This step ensures the performance, scaling and maintain capability 
✅ Step 3: Design UI/UX (if we own the project or this phase of project)
✅ Step 4: Implementation => Should follow the coding convention, development model/process (Ex: Agile), including the self test, unit test...
✅ Step 5: Testing & Optimization.
✅ Step 6: Deployment & Monitoring

3️⃣ How I Learn New Topics Efficiently
   - Start with WHY. Why I need to learn it, it can solve which problem in real life/work
   - Read the official documents with the topics related to the problem
   - Create the simulator, practice environment to learn by practice
   - Research from online communities/forums or AI tools
   - Follow Experts – Read blog posts and GitHub repositories
   - Ask for reviewing the learning result by seniors or experts (if I know them)
   - 
4️⃣ "Consistency" vs "Fast & Efficient"
    - The best answer is "Consistency", long-term stability is more important than speed.
    But sometimes we have to choose Fast & Efficient, it depends on the most importance at the current development phase.
    We can make a short-term plan beside the long-term one for a purpose like demo or something. Then take some time to refactor the code.

5️⃣ Do I Own Any Apple Products?
   - Yes, I have iPhone 11 and iPad Gen 8

6️⃣ Immediate Availability to Start
   - I'm Ready to start immediately

# PMS MVP Monorepo

This repository contains a Turborepo with frontend (Next.js) and backend (Express/TypeScript). It includes Firebase-based storage today and optional Amazon RDS PostgreSQL setup.

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Install dependencies for all Apps

`npm install -w`
or
`yarn install -w`

### Build

To build all apps and packages, run the following command:

```
cd pms-mvp-monorepo
yarn build
```

### Develop

To develop all apps and packages, run the following command:

```
cd pms-mvp-monorepo
yarn dev
```

## Backend: File Storage (Local or AWS S3)

The backend supports two storage providers for attachments:

- local (default): files are saved under apps/backend/uploads and served via /uploads/*.
- s3: files are uploaded to an AWS S3 bucket.

Configure the provider via environment variables in apps/backend/.env:

Required for both:
- FILE_STORAGE_PROVIDER=local | s3

If FILE_STORAGE_PROVIDER=s3, also set:
- AWS_REGION=ap-southeast-1 (example)
- AWS_ACCESS_KEY_ID=... (optional if running on an AWS role)
- AWS_SECRET_ACCESS_KEY=... (optional if running on an AWS role)
- S3_BUCKET=your-bucket-name
- S3_PUBLIC_URL_BASE=https://your-bucket.s3.amazonaws.com (optional; if omitted, the API will construct https://S3_BUCKET.s3.AWS_REGION.amazonaws.com/<key>)

API endpoints:
- POST /api/tasks/:taskId/attachments with multipart/form-data field file to upload.
- GET  /api/tasks/:taskId/attachments to list attachments for a task.
- DELETE /api/attachments/:id to delete an attachment (removes from storage and database).

Notes:
- When using S3, the original filename is normalized and prefixed with a timestamp to form the S3 object key stored in the database.
- The TaskAttachment.url will be a public URL only if your bucket or CDN allows public access for objects; otherwise it may be null.


===== Answers of Part 4: Firestore Query for Ranking & Active Status Update Strategy =====

1. Problem: Multi-Factor Ranking with Pagination 
   We need a query to rank users efficiently based on:
   - Total Average Weight Ratings (Highest Priority)
   - Number of Rents
   - Recently Active Time
2. Solution: Precompute a Ranking Score
   To rank users correctly, we calculate a ranking score before querying
   Formula for rankingScore:
   `(totalAverageWeightRatings * 1000) + (numberOfRents * 10) + (recentlyActive / 1_000_000);`
3. Explanation:
   Multiplying `totalAverageWeightRatings` by 1000 ensures it has the highest priority.
   Multiplying `numberOfRents` by 10 makes it secondary.
   Dividing `recentlyActive` by 1,000,000 ensures it contributes without overpowering the first two factors.
4. Firestore Query with Pagination
   4.1. Firestore Query with Pagination
   ```
   import { db } from "../config/firebaseConfig";
   export const fetchRankedUsers = async (lastDoc: any = null, limit: number = 10) => {
       let query = db.collection("USERS").orderBy("rankingScore", "desc").limit(limit);

       if (lastDoc) {
          query = query.startAfter(lastDoc);
       }

       const snapshot = await query.get();
       return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
   };
   ```
   4.2. Keep `recentlyActive` Updated Automatically
        Users' `recentlyActive` field should be updated whenever they perform an action.
        Firestore Trigger to Update `recentlyActive` & `rankingScore`, use Firebase Cloud Function to update recentlyActive when users interact.

================  Answer Part 5: Personality & Technical Questions ================ 

1️⃣ **Most Difficult Technical Problems & Solutions**
   - Problem: Develop the large-scale application, ensure it can be easy to maintain, extend and upgrade/migrate the new lib version or new platform/technologies.
   - Issue:
     + Libs have some deprecated features cause or conflicts between frameworks and libs when we upgrade to new version. Ex: upgrade from Next 13/14 to Next 15.
     + Migrate from Google Cloud to AWS takes much time
     + Source code comes larger and must migrate to mono-repo, apply the microservice architecture. => It's the big challenge when 
   - Fix: I divide to smaller step, make the plan to do:
     + What features/modules can be migrated/upgraded first
     + How many efforts to make things done
     + What risks and are there any chance to roll back the changes
     + ....

2️⃣ **When you’re working on a project, how do you typically approach it from start to finish**
✅ Step 1: Analyze the requirement, define the project scope, make the plan => We can't do anything we don't understand why, what we will do and when we start and finish.
✅ Step 2: Design the architecture, choose suitable technologies => Next step is define how to do. This step ensures the performance, scaling and maintain capability 
✅ Step 3: Design UI/UX (if we own the project or this phase of project)
✅ Step 4: Implementation => Should follow the coding convention, development model/process (Ex: Agile), including the self test, unit test...
✅ Step 5: Testing & Optimization.
✅ Step 6: Deployment & Monitoring

3️⃣ How I Learn New Topics Efficiently
   - Start with WHY. Why I need to learn it, it can solve which problem in real life/work
   - Read the official documents with the topics related to the problem
   - Create the simulator, practice environment to learn by practice
   - Research from online communities/forums or AI tools
   - Follow Experts – Read blog posts and GitHub repositories
   - Ask for reviewing the learning result by seniors or experts (if I know them)
   - 
4️⃣ "Consistency" vs "Fast & Efficient"
    - The best answer is "Consistency", long-term stability is more important than speed.
    But sometimes we have to choose Fast & Efficient, it depends on the most importance at the current development phase.
    We can make a short-term plan beside the long-term one for a purpose like demo or something. Then take some time to refactor the code.

5️⃣ Do I Own Any Apple Products?
   - Yes, I have iPhone 11 and iPad Gen 8

6️⃣ Immediate Availability to Start
   - I'm Ready to start immediately


## Backend: Notifications and Activity Logs

The backend now exposes endpoints for user notifications and activity logs with basic sorting and filtering.

Database schema:
- Table activity_logs already exists in apps/backend/db/pms.sql
- Table notifications added to apps/backend/db/pms.sql
  - Run: yarn build && (cd apps/backend && node ./dist/utils/run-sql.js apps/backend/db/pms.sql)

Auth: All routes below require authMiddleware (same as other /api routes).

Activity endpoints:
- GET /api/activity
  - Query params (all optional):
    - limit (1..100, default 20)
    - before (ISO string)
    - workspaceId, projectId, taskId
    - action, actorId
    - from, to (ISO strings)
    - order=asc|desc (default desc)
- GET /api/tasks/:taskId/activity
  - Same query params as above, taskId fixed from path

Notifications endpoints:
- GET /api/notifications
  - Query params: limit, before, unreadOnly=true|false, type, entityType, order=asc|desc
  - Returns notifications for current user (req.userId)
- POST /api/notifications
  - Body: { userId, type, title?, body?, entityType?, entityId?, meta? }
  - Creates a notification (for system/admin or other server-side triggers)
- POST /api/notifications/:id/read
  - Marks one notification as read (only for current user)
- POST /api/notifications/read-all
  - Marks all current user's notifications as read

Notes:
- This is a minimal MVP. Domain services (e.g., task assignment, mentions) should call POST /api/notifications or directly use the repository to emit notifications when relevant events occur.
- Activity logs can be filtered and sorted by common fields; extend as needed.


## Backend: Project Management

Relationships
- A Workspace groups users and projects. Users join a workspace via workspace_members.
- A Project belongs to exactly one Workspace (projects.workspace_id).
- A Task belongs to exactly one Project (tasks.project_id) and one Board/Column within that project.

Routes (all require authMiddleware and live under /api):
- GET  /api/workspaces/:workspaceId/projects?q=&limit=&before=&order=asc|desc
- POST /api/workspaces/:workspaceId/projects
  - Body: { name, description? }
- GET  /api/projects/:id
- PATCH /api/projects/:id
  - Body: any subset of { name, description }
- DELETE /api/projects/:id

Notes:
- Activity logs are emitted on create/update/delete (activity_logs table) with workspaceId and projectId.
- Tasks already belong to projects; you can manage tasks under /api/projects/:projectId/tasks.

## Backend: Task Management

The backend now includes minimal task management APIs (CRUD, listing and assignees) built on the existing PostgreSQL schema (tasks, task_assignees).

Routes (all require authMiddleware and live under /api):
- POST /api/projects/:projectId/tasks
  - Body: { boardId, columnId?, title, description?, status?, priority?, dueDate? }
- GET  /api/projects/:projectId/tasks?boardId=&columnId=&status=&q=&assigneeId=&limit=&before=&order=asc|desc
- GET  /api/tasks/:id
- PATCH /api/tasks/:id
  - Body: any subset of { title, description, status, priority, dueDate, boardId, columnId }
- DELETE /api/tasks/:id
- GET  /api/tasks/:id/assignees
- POST /api/tasks/:id/assignees
  - Body: { userId }
- DELETE /api/tasks/:id/assignees/:userId
- GET  /api/tasks/:taskId/comments?limit=&before=&order=asc|desc

Notes:
- You can add attachments when creating or updating a task by sending multipart/form-data and including one or more files under the field name "files" (or a single file under "file"). The create (POST /api/projects/:projectId/tasks) and update (PATCH /api/tasks/:id) endpoints accept files and will upload them to the configured storage (local or S3) and link them to the task.
- Activity logs are emitted on create/update/delete/assign/unassign (activity_logs table).
- A notification is emitted to the assigned user on assignment (notifications table), if assignee != actor.
- Attachments endpoints already exist under /api/tasks/:taskId/attachments.
- Comments listing endpoint lets clients paginate and sort by created_at; default order is desc.
- Task status enum: 0=to do, 1=in progress, 2=in review, 3=done, 4=closed, 5=on hold. You may pass either the numeric code or the name (e.g., "in progress"); API normalizes to the number.


## Backend: Workspace/Project Switching

To support quick switching between places you worked recently, the backend exposes endpoints to list recent workspaces and projects for the current user, as well as all projects accessible to the user across their workspaces.

Routes (all require authMiddleware and live under /api/me):
- GET /api/me/recent/workspaces?limit=10
  - Returns the most recently active workspaces for the current user, inferred from activity logs. Each item includes lastActivityAt.
- GET /api/me/recent/projects?limit=10
  - Returns the most recently active projects for the current user, inferred from activity logs. Each item includes lastActivityAt.
- GET /api/me/projects?q=&limit=&before=&order=asc|desc
  - Lists all projects the current user can access (member of the corresponding workspace), optionally filtered by q.

Notes:
- Recent lists are derived from activity_logs by grouping on workspace_id/project_id for the current user (actor_id).
- No schema changes are required; this is a lightweight MVP to enable client-side workspace/project switchers.

## Backend: API Docs (Swagger)

A minimal Swagger UI is available to try the API.

- After starting the backend (port 3100 by default), open: http://localhost:3100/docs
- The raw OpenAPI spec is served at: http://localhost:3100/docs.json
- Auth: For protected endpoints, click "Authorize" and paste your Firebase ID token as: `Bearer <token>`

Location of the spec: apps/backend/src/openapi.json

Notes:
- Only a subset of endpoints are documented initially (/health, /users/{id}, /api/me). Extend the spec over time to cover more routes.



## Auth: Register & Password Flows

This repository now includes basic authentication flows in the frontend app (Next.js + MUI):

- Register: /register — create a new user; default role is `member`.
- Forgot Password: /forgot-password — request a password reset link by email.
- Reset Password: /reset-password?token=... — set a new password using the emailed token.
- Change Password: /change-password — change password for a signed-in user (protected route).

Implementation notes:

- The frontend dispatches Redux thunks that call conventional REST API endpoints:
  - POST /auth/register { name, email, password, role: 'member' }
  - POST /auth/forgot-password { email }
  - POST /auth/reset-password { token, password }
  - POST /auth/change-password { currentPassword, newPassword }
- On successful registration, if the backend responds with `{ token, user }`, the user is signed in automatically; otherwise the user is redirected to the login page.
- Axios base URL is `process.env.NEXT_PUBLIC_API_URL`. Ensure your backend exposes the above endpoints under this base URL.
- The auth token is stored in localStorage as `authToken` for use by the Axios interceptor.

Known unrelated type-check issues (pre-existing):

- apps/frontend/jest.config.ts: TS2306 regarding `@types/jest`. (Jest is not configured in this template.)
- apps/frontend/src/features/tasks/components/TaskList/index.tsx: missing legacy import `@/components/tasks/TaskList`.

These do not affect the new auth flows. Adjust or remove those files if you need a clean `tsc` run.



## Initialize the RDS PostgreSQL database

To initialize your AWS RDS PostgreSQL instance with this project's schema and seed data, use the provided scripts. Ensure your RDS security group allows incoming traffic from your current IP on port 5432.

Prerequisites:
- apps/backend/.env is configured with your RDS details (PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE). For RDS without custom certs, set PGSSL=true.
- Node.js >=18 and Yarn installed.

Commands (run from repo root):
- Test connection: yarn db:test
- Apply schema only: yarn db:schema
- Seed sample data only: yarn db:seed
- Initialize everything (schema + seed): yarn db:init

Notes:
- These scripts rely on a helper (dist/utils/run-sql.js) that executes SQL from apps/backend/db/*.sql.
- If you use a single DATABASE_URL, you can set it in apps/backend/.env instead of individual PG* vars.
- If you see ECONNREFUSED or timeout, verify the RDS security group and that your current IP is allowed.
- If SSL certificate validation issues occur, keep PGSSL=true (it disables strict cert validation by using rejectUnauthorized: false).



## Manage AWS RDS from JetBrains IDEs

If you prefer to manage and query your AWS RDS databases directly from a JetBrains IDE, you have a few excellent options. These work great with the PostgreSQL database used by this project (and also with MySQL, if you use it).

Recommended options
- DataGrip (standalone database IDE): Full-featured SQL client from JetBrains.
  - https://www.jetbrains.com/datagrip/
- Database Tools and SQL (built into IntelliJ IDEA Ultimate, WebStorm, PyCharm Professional, etc.): Same engine as DataGrip.
  - Docs: https://www.jetbrains.com/help/idea/connecting-to-a-database.html
- AWS Toolkit for JetBrains: Adds an AWS Explorer, RDS integration, IAM/Secrets Manager workflows, and can create data sources in the IDE.
  - Plugin: https://plugins.jetbrains.com/plugin/11349-aws-toolkit

Note for Community editions: JetBrains Database Tools are not available in Community IDEs. A third‑party plugin called "Database Navigator" exists, but JetBrains DataGrip/Ultimate tools are recommended for reliability and SSL/IAM features.

Connecting to RDS PostgreSQL with password auth
1. Install either DataGrip or use Database Tools in your JetBrains IDE (Ultimate/Pro editions).
2. Create a new data source: PostgreSQL.
3. Enter your RDS endpoint, port, database, user, and password:
   - Host: your RDS endpoint (e.g., database-1.xxxxxx.ap-southeast-2.rds.amazonaws.com)
   - Port: 5432
   - Database: postgres (or your DB name)
   - User/Password: your DB credentials
4. SSL: For RDS it’s best to enable SSL. In the driver settings:
   - Set SSL mode to require (quickest) or verify-ca/verify-full (more secure).
   - For verify-ca/verify-full, download the RDS root certificate bundle and point the IDE to it.
     - AWS RDS global bundle: https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
   - If you use require and cannot validate the certificate, connections still encrypt but do not verify CA.
5. Test connection and save.

JDBC URL templates
- PostgreSQL (password auth):
  - jdbc:postgresql://<rds-endpoint>:5432/<database>?sslmode=require
- MySQL (if applicable):
  - jdbc:mysql://<rds-endpoint>:3306/<database>?sslMode=REQUIRED

Connecting to RDS using AWS IAM authentication (optional)
You can connect without a stored DB password by using temporary auth tokens.

Option A — Via AWS Toolkit for JetBrains (recommended)
- Install AWS Toolkit and configure an AWS connection (Settings > Tools > AWS, select an AWS profile/keys).
- Open AWS Explorer (View > Tool Windows > AWS Explorer), expand RDS, locate your instance.
- Right-click the DB instance and choose Connect. The Toolkit can create a preconfigured data source that uses IAM.
- The IDE will obtain a temporary auth token and open the connection. Tokens expire (typically in 15 minutes), so the IDE may refresh them automatically when reconnecting.

Option B — Manual token generation (CLI)
- Ensure your DB user has IAM auth enabled (GRANT rds_iam TO your_user; for PostgreSQL on RDS).
- Generate a token with AWS CLI and use it as the password for the connection:
  - aws rds generate-db-auth-token --hostname <rds-endpoint> --port 5432 --region <region> --username <db-user>
- In the IDE, set user=<db-user>, password=<generated-token>, SSL mode=require or verify-ca, and connect.

Secrets Manager integration (optional)
- With AWS Toolkit, you can store DB credentials in AWS Secrets Manager and reference them from the IDE. In AWS Explorer, right‑click a Secret to view/copy JDBC details or create a connection.

Troubleshooting
- Cannot connect / timeout: Ensure your RDS Security Group allows inbound TCP 5432 from your current IP. If RDS is not publicly accessible, connect via VPN/DirectConnect or configure an SSH tunnel (Database Tools support SSH tunnels) through a bastion host in the VPC.
- SSL handshake issues: Use sslmode=require to start. For strict validation, use verify-ca/verify-full and the AWS RDS CA bundle. Ensure system time is correct.
- IAM auth fails: Confirm your DB user has rds_iam privileges and that you’re connecting with the correct AWS profile/region. Tokens expire quickly; reconnect if needed.
- Permission denied: Verify the DB user permissions and that the database/role exists. For brand‑new instances, connect as master user to create roles/schemas.

Quick start (PostgreSQL with password auth)
1) Install DataGrip or use IDE Database Tools.
2) New Data Source > PostgreSQL.
3) Host: your RDS endpoint, Port: 5432, DB: postgres (or your DB), User/Password: as configured.
4) SSL: Mode=require (or verify-ca with the AWS CA bundle).
5) Test Connection > OK.

These steps complement the command-line initialization scripts (yarn db:test, yarn db:schema, yarn db:seed, yarn db:init) by letting you browse schemas, run queries, and manage data visually from your JetBrains IDE.


## Troubleshooting: Connected to RDS but no schemas/tables are visible

If your IDE or SQL client connects successfully to your Amazon RDS PostgreSQL instance but you don’t see any schemas or tables, try the following:

1) Verify you are connected to the correct database name
- Check apps/backend/.env → PGDATABASE. RDS often has multiple DBs (e.g., "postgres" vs your app DB). Ensure your client is using the same database name.

2) Initialize the schema in the correct order
- From the repo root, run:
  - yarn db:test
  - yarn db:init
- This will execute the SQL files in the proper order: initial.sql (users), pms.sql (core tables), then seed.sql.
- The schema file now ensures the required extension (pgcrypto) is present for gen_random_uuid().

3) Verify what exists with the built-in checker
- Run from repo root: yarn db:verify
- This prints user schemas and tables, and verifies the expected tables in the "pms" schema (falls back to "public" if "pms" does not exist). It also shows the active database/user.

4) Refresh your IDE’s objects tree and check filters
- In DataGrip/Database Tools, click the Refresh icon.
- Ensure the schema filter includes "pms" (and "public"). Sometimes IDEs hide non-selected schemas; click the small schema selector and tick "pms".

5) Check permissions
- Make sure the DB user has privileges to CREATE EXTENSION and create tables in the target database. For RDS, use the master user or a role with sufficient privileges the first time you run the schema.

Expected tables (pms schema):
- users, workspaces, workspace_members, projects, boards, board_columns, tasks, task_assignees, labels, task_labels, comments, activity_logs, task_attachments, notifications, project_members

If you still can’t see tables after running yarn db:init and yarn db:verify, please capture the console output and error messages and share them. We will help diagnose (common issues include insufficient privileges, connecting to the wrong DB, or security group/SSL configuration).


## Users password storage (PostgreSQL)

If you do not see any password-related field in the users table, update the schema and set passwords as follows:

1) Ensure the schema is up-to-date (adds users.password_hash column)
- From repo root:
  - yarn workspace pms-mvp-backend run build
  - yarn db:initial  # or yarn db:init to run full chain

2) Set or change a user password (PBKDF2 hashed)
- Use the new CLI utility from the backend workspace:
  - yarn workspace pms-mvp-backend run auth:set-password <email> <newPassword>
- Examples:
  - yarn workspace pms-mvp-backend run auth:set-password nhatnguyen.nguyen23@gmail.com Admin@12345
  - yarn workspace pms-mvp-backend run auth:set-password owner@example.com Owner@12345

Notes:
- The password is not stored in plaintext; it’s saved in users.password_hash as a PBKDF2 string (pbkdf2$iterations$salt$hexhash).
- Seeded users created by db/seed.sql don’t have passwords by default. Use the command above to set them if you want to log in with those accounts.
- You can verify tables and schemas via: yarn db:verify
