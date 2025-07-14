import { FileService } from "../services/file.service"

export const FileController = {
    upload: async ({ request, query }: any) => {
        const form = await request.formData()
        const folderId = query?.folderId ? Number(query.folderId) : undefined
        
        // Coba ambil dari "file" atau "file[]"
        let files = form.getAll("file") as File[]
        if (files.length === 0) {
            files = form.getAll("file[]") as File[]
        }

        // Filter file yang valid
        const validFiles = files.filter(f => f && typeof f === "object" && "name" in f && "type" in f)
        if (validFiles.length === 0) {
            return {
                error: true,
                message: "No valid file uploaded"
            }
        }

        // Jika hanya 1 file, kirim objek File saja
        const input = validFiles.length === 1 ? validFiles[0] : validFiles

        try {
            const saved = await FileService.uploadFile(input, folderId)
            return {
                success: true,
                data: saved
            }
        } catch (err) {
            console.error("Upload failed:", err)
            return {
                error: true,
                message: "Failed to upload file(s)"
            }
        }
    },

    getByFolder: async ({ params }: any) => {
        if (!params.folderId) {
            throw new Error('Folder ID is required')
        }

        if (isNaN(Number(params.folderId))) {
            throw new Error('Folder ID must be a number')
        }

        return FileService.getFilesInFolder(Number(params.folderId))
    },

    getById: async ({ params }: any) => {
        if (!params.id) {
            throw new Error('File ID is required')
        }

        if (isNaN(Number(params.id))) {
            throw new Error('File ID must be a number')
        }

        const file = await FileService.getFileById(Number(params.id))

        if (!file) {
            return { error: "File not found" }
        }

        return file
    },

    getRootFiles: async () => {
        return FileService.getRootFiles()
    },

    stream: async ({ params }: any) => {
        if (!params.id) {
            throw new Error('File ID is required')
        }

        if (isNaN(Number(params.id))) {
            throw new Error('File ID must be a number')
        }

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
        if (!params.id) {
            throw new Error('File ID is required')
        }

        if (isNaN(Number(params.id))) {
            throw new Error('File ID must be a number')
        }

        const file = await FileService.getFileById(Number(params.id))
        if (!file) {
            return { error: "File not found" }
        }

        await FileService.deleteFile(Number(params.id))
        return { message: "File deleted successfully" }
    },
}
