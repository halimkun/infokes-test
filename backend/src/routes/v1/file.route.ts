import { Elysia } from "elysia"
import { FileController } from "../../controllers/file.controller"

export const FileRouter = new Elysia({ prefix: "/api/v1/files" })
    .post("/upload", FileController.upload)
    .get("/:id", FileController.getById)
    .get("/:id/stream", FileController.stream)
    .get("/folder/:folderId", FileController.getByFolder)
    .delete("/:id", FileController.delete)