import { FolderRepository } from '../repositories/folder.repository'

export const FolderService = {
    getAllFolders: () => FolderRepository.findAll(),
    getFolder: (id: number) => FolderRepository.findById(id),
    getFoldersByParentId: (parentId: number) => FolderRepository.findByParentId(parentId),
    getRootFolders: () => FolderRepository.findRootFolders(),
    createFolder: (name: string, parentId?: number) => FolderRepository.create({ name, parentId }),
    updateFolder: (id: number, name?: string, parentId?: number) => FolderRepository.update(id, { name, parentId }),
    deleteFolder: (id: number) => FolderRepository.delete(id),
    deleteRecursiveFolder: async (id: number) => FolderRepository.deleteFolderRecursively(id),
}
