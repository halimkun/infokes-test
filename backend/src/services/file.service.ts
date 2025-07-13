import { FileRepository } from "../repositories/file.repository"
import { unlinkSync, writeFileSync, mkdirSync, existsSync, createReadStream } from "fs"
import { join } from "path"

export const FileService = {
    uploadFile: async (file: File, folderId?: number) => {
        const buffer = Buffer.from(await file.arrayBuffer())
        const uploadDir = "uploads"

        // Buat folder jika belum ada
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir)
        }

        const filePath = join(uploadDir, file.name)
        writeFileSync(filePath, buffer)

        const saved = await FileRepository.create({
            name: file.name,
            path: filePath,
            size: file.size,
            mimeType: file.type,
            folderId,
        })

        return saved
    },


    getFilesInFolder: (folderId: number) => FileRepository.findByFolderId(folderId),

    getFileById: (id: number) => FileRepository.findById(id),

    streamFile: async (id: number) => {
        const file = await FileRepository.findById(id)
        if (!file) throw new Error("File not found")

        const filePath = join(__dirname, "../../", file.path)
        if (!existsSync(filePath)) {
            throw new Error("File does not exist on disk")
        }

        const stream = createReadStream(filePath)

        const inlineMimeTypes = [
            'application/pdf',
            'text/plain',
            'image/jpeg',
            'image/png',
            'image/gif',
            'text/html',
            'text/css',
            'application/json',
            'image/svg+xml'
        ]
        
        const mimeMainType = file.mimeType.split(';')[0].trim()
        const isInline = inlineMimeTypes.includes(mimeMainType)

        return {
            stream,
            headers: {
                "Content-Type": file.mimeType,
                "Content-Disposition": `${isInline ? 'inline' : 'attachment'}; filename="${file.name}"`,
                "Content-Length": file.size.toString(),
            }
        }
    },

    deleteFile: async (id: number) => {
        const file = await FileRepository.findById(id)
        if (!file) throw new Error("File not found")

        // Cek dan hapus file fisik
        if (file.path && existsSync(file.path)) {
            unlinkSync(file.path)
        }

        // Hapus data dari database
        return FileRepository.delete(id)
    }
}
