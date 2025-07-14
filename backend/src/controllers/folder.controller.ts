import { FolderService } from '../services/folder.service'

export const FolderController = {
    getAll: async () => FolderService.getAllFolders(),

    getOne: async ({ params }: any) => {
        if (!params.id) {
            throw new Error('Folder ID is required')
        }

        if (isNaN(Number(params.id))) {
            throw new Error('Folder ID must be a number')
        }

        return FolderService.getFolder(Number(params.id))
    },

    create: async ({ body }: any) => {
        const { name, parentId } = body
        return FolderService.createFolder(name, parentId)
    },

    update: async ({ params, body }: any) => {
        const { name, parentId } = body

        if (!params.id) {
            throw new Error('Folder ID is required')
        }

        if (isNaN(Number(params.id)) || (parentId && isNaN(Number(parentId)))) {
            throw new Error('Folder ID must be a number')
        }

        return FolderService.updateFolder(Number(params.id), name, parentId)
    },

    delete: async ({ params }: any) => {
        if (!params.id) {
            throw new Error('Folder ID is required')
        }

        if (isNaN(Number(params.id))) {
            throw new Error('Folder ID must be a number')
        }

        return FolderService.deleteFolder(Number(params.id))
    },

    deleteRecursive: async ({ params }: any) => {
        if (!params.id) {
            throw new Error('Folder ID is required')
        }

        if (isNaN(Number(params.id))) {
            throw new Error('Folder ID must be a number')
        }

        return FolderService.deleteRecursiveFolder(Number(params.id))
    },

    getByParentId: async ({ params }: any) => {
        if (!params.parentId) {
            throw new Error('Parent ID is required')
        }

        if (isNaN(Number(params.parentId))) {
            throw new Error('Parent ID must be a number')
        }

        return FolderService.getFoldersByParentId(Number(params.parentId))
    },

    getRootFolders: async () => FolderService.getRootFolders()
}