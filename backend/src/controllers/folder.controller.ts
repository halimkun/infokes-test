import { FolderService } from '../services/folder.service'

export const FolderController = {
    getAll: async () => FolderService.getAllFolders(),
    getOne: async ({ params }: any) => FolderService.getFolder(Number(params.id)),
    create: async ({ body }: any) => {
        const { name, parentId } = body
        return FolderService.createFolder(name, parentId)
    },
    update: async ({ params, body }: any) => {
        const { name, parentId } = body
        return FolderService.updateFolder(Number(params.id), name, parentId)
    },
    delete: async ({ params }: any) => FolderService.deleteFolder(Number(params.id)),
    deleteRecursive: async ({ params }: any) => FolderService.deleteRecursiveFolder(Number(params.id)),
    getByParentId: async ({ params }: any) => FolderService.getFoldersByParentId(Number(params.parentId)),
    getRootFolders: async () => FolderService.getRootFolders()
}