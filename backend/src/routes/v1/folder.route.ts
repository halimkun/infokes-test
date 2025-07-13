import { Elysia } from 'elysia'
import { FolderController } from '../../controllers/folder.controller'

export const FolderRouter = new Elysia({ prefix: '/api/v1/folders' })
    .get('/', FolderController.getAll)
    .get('/root', FolderController.getRootFolders)
    .get('/:id', FolderController.getOne)
    .get('/parent/:parentId', FolderController.getByParentId)
    .post('/', FolderController.create)
    .put('/:id', FolderController.update)
    .delete('/:id', FolderController.deleteRecursive)
