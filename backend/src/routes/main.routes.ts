import { Elysia } from 'elysia'

export const mainRoutes = new Elysia()
    .get('/', async () => {
        var text = "API is running";
        text += "\nFolder API is available at /api/v1/folders";
        text += "\nFile API is available at /api/v1/files";

        return text;
    })
