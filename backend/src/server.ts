import { Elysia } from 'elysia'
import { FolderRouter } from './routes/v1/folder.route'
import { mainRoutes } from './routes/main.routes'
import { FileRouter } from "./routes/v1/file.route"

export const app = new Elysia()
    .use(FolderRouter)
    .use(FileRouter)
    .use(mainRoutes)