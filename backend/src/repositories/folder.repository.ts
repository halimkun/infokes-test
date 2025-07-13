import { prisma } from '../config/prisma'
import { FileService } from '../services/file.service'

export const FolderRepository = {
    findAll: () => prisma.folder.findMany(),
    findById: (id: number) => prisma.folder.findUnique({ where: { id } }),
    findByParentId: (parentId: number) => prisma.folder.findMany({ where: { parentId } }),
    findRootFolders: () => prisma.folder.findMany({ where: { parentId: null } }),
    create: (data: { name: string, parentId?: number }) => prisma.folder.create({ data }),
    update: (id: number, data: { name?: string, parentId?: number }) => prisma.folder.update({ where: { id }, data }),
    delete: (id: number) => prisma.folder.delete({ where: { id } }),
    deleteFolderRecursively: async (id: number): Promise<any> => {
        const subFolders = await prisma.folder.findMany({ where: { parentId: id } })

        for (const subFolder of subFolders) {
            await FolderRepository.deleteFolderRecursively(subFolder.id)
        }

        // ✅ Ambil semua file dalam folder ini
        const files = await prisma.file.findMany({ where: { folderId: id } })

        for (const file of files) {
            // ✅ Gunakan service untuk delete file (disk + db)
            await FileService.deleteFile(file.id)
        }

        return prisma.folder.delete({ where: { id } })
    }
}