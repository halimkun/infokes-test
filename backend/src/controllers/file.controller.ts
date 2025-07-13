import { FileService } from "../services/file.service"
import { createReadStream, writeFileSync } from "fs"
import { join } from "path"

export const FileController = {
    upload: async ({ request, query }: any) => {
        const form = await request.formData()
        const file = form.get("file") as File

        if (!file) {
            return { error: "File not found" }
        }

        const folderId = query?.folderId ? Number(query.folderId) : undefined

        return FileService.uploadFile(file, folderId)
    },

    getByFolder: async ({ params }: any) => FileService.getFilesInFolder(Number(params.folderId)),

    getById: async ({ params }: any) => {
        const file = await FileService.getFileById(Number(params.id))
        if (!file) {
            return { error: "File not found" }
        }
        return file
    },

    stream: async ({ params }: any) => {
        const file = await FileService.getFileById(Number(params.id))
        // file contains : id, name, path, size, mimeType, folderId, createdAt, updatedAt
        if (!file) {
            return { error: "File not found" }
        }

        // use streamFile function from FileService
        const { stream, headers } = await FileService.streamFile(Number(params.id))

        // Convert Node.js ReadStream to a web-compatible ReadableStream
        const readableStream = new ReadableStream({
            start(controller) {
                stream.on("data", (chunk) => controller.enqueue(chunk))
                stream.on("end", () => controller.close())
                stream.on("error", (err) => controller.error(err))
            }
        })

        return new Response(readableStream, { headers })
    },

    delete: async ({ params }: any) => {
        const file = await FileService.getFileById(Number(params.id))
        if (!file) {
            return { error: "File not found" }
        }

        await FileService.deleteFile(Number(params.id))
        return { message: "File deleted successfully" }
    },
}
