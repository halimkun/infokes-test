import { FileRepository } from "../repositories/file.repository"
import { unlinkSync, writeFileSync, mkdirSync, existsSync, createReadStream } from "fs"
import { join } from "path"
import { randomBytes } from "crypto"

export const FileService = {
    uploadFile: async (file: File | File[], folderId?: number) => {
        const uploadDir = "uploads"
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true })
        }

        const processSingleFile = async (f: File) => {
            const arrayBuffer = await f.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            const ext = f.name.includes(".") ? f.name.substring(f.name.lastIndexOf(".")) : ""
            const randomName = `${randomBytes(16).toString("hex")}${ext}`
            const filePath = join(uploadDir, randomName)

            writeFileSync(filePath, buffer)

            return await FileRepository.create({
                name: f.name,
                path: filePath,
                size: f.size,
                mimeType: f.type,
                folderId,
            })
        }

        if (Array.isArray(file)) {
            const savedFiles = await Promise.all(file.map(processSingleFile))
            return savedFiles // return array of saved entries
        } else {
            const savedFile = await processSingleFile(file)
            return savedFile // return single saved entry
        }
    },

    getFilesInFolder: (folderId: number) => FileRepository.findByFolderId(folderId),

    getFileById: (id: number) => FileRepository.findById(id),

    getRootFiles: () => FileRepository.findRootFiles(),

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
