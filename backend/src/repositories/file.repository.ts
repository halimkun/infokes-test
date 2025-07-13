import { prisma } from "../config/prisma"

export const FileRepository = {
    create: (data: {
        name: string
        path: string
        size: number
        mimeType: string
        folderId?: number
    }) => prisma.file.create({ data }),

    findByFolderId: (folderId: number) => prisma.file.findMany({ where: { folderId } }),

    findById: (id: number) => prisma.file.findUnique({ where: { id } }),

    delete: (id: number) => prisma.file.delete({ where: { id } }),
}
