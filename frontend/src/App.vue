<template>
  <div class="p-4 h-screen space-y-4">
    <div class="h-14 flex items-center justify-between bg-zinc-900 px-5 py-2 rounded-lg border border-zinc-700">
      <p class="leading-none text-xl font-semibold">File Explorer</p>
      <div class="flex gap-3">
        <Button raised rounded variant="outlined" icon="pi pi-folder-plus" @click="openModal" severity="success" size="small" />
        <Button raised rounded variant="outlined" icon="pi pi-upload" @click="openUploadModal" severity="info" size="small" />
      </div>
    </div>

    <div class="h-[calc(100vh-7rem)] border border-zinc-700 rounded-lg overflow-hidden anti-aliased">
      <Splitter class="h-full">
        <SplitterPanel class="hidden md:block" :size="20" :minSize="20">
          <ScrollPanel class="w-full h-full max-h-full">
            <Tree 
              selectionMode="single" 
              class="w-full" 
              loadingMode="icon" 
              v-model:selectionKeys="selectedKey"
              v-model:expandedKeys="expandedKeys" 
              :value="nodes" 
              @nodeExpand="onNodeExpand" 
              @nodeSelect="onNodeSelect"
              @nodeUnselect="onNodeUnselect"
            >
              <template #default="slotProps">
                <a v-if="slotProps.node.data.type === 'file'" :href="`/api/files/${slotProps.node.data.id}/stream`"
                  target="_blank">
                  {{ slotProps.node.label }}
                </a>
                <span v-else>
                  {{ slotProps.node.label }}
                </span>
              </template>
            </Tree>
          </ScrollPanel>
        </SplitterPanel>

        <SplitterPanel :size="80" :minSize="50">
          <template v-if="node">
            <template v-if="node.children && node.children.length > 0">
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 p-4">
                <template v-for="child in node.children" :key="child.key">
                  <ItemGrid :child="child" :onNodeSelect="onNodeSelect" />
                </template>
              </div>
            </template>
          </template>
          <template v-else>
            <div class="h-full flex items-center justify-center">
              <div class="text-center text-gray-500">
                <p class="text-lg">Select a folder to view its contents</p>
                <p class="text-sm">Files will open in a new tab</p>
              </div>
            </div>
          </template>
        </SplitterPanel>
      </Splitter>
    </div>
  </div>

  <!-- Modal Create Folder -->
  <Dialog v-model:visible="isModalOpen" header="Create New Folder" :style="{ width: '35rem' }" :modal="true" :draggable="false">
    <form action="#!" method="post" @submit.prevent="createFolder">
      <p class="mb-2 text-gray-300">Enter the name of the new folder you want to create.</p>
      <template v-if="node">
        <Message severity="info" class="mb-2">Creating a new folder inside: {{ node.label }}</Message>
      </template>
      <div class="flex flex-col items-end justify-center">
        <InputText v-model="newFolderName" placeholder="Enter folder name" class="w-full mb-4" />
        <Button size="small" icon="pi pi-check" label="Create" type="submit" severity="success" />
      </div>
    </form>
  </Dialog>

  <!-- Modal Upload Form -->
  <Dialog v-model:visible="isUploadModalOpen" header="Upload File" :style="{ width: '35rem' }" :modal="true" :draggable="false">
    <FileUpload name="file[]" :url="uploadUrl" @upload="onAdvancedUpload($event)" :multiple="true" :maxFileSize="1000000">
        <template #empty>
            <span>Drag and drop files to here to upload.</span>
        </template>
    </FileUpload>
  </Dialog>
</template>

<style scoped>
.p-splitter {
  border: none;
}
</style>

<script setup>
import { onMounted, ref } from 'vue'
import { computed } from 'vue';
import ItemGrid from './components/ItemGrid.vue';

const selectedKey = ref(null)
const expandedKeys = ref({});
const nodes = ref([])
const node = ref(null)

const uploadUrl = computed(() => {
  const id = node.value?.data?.id
  return id ? `/api/files/upload?folderId=${id}` : "/api/files/upload"
})

const isModalOpen = ref(false)
const isUploadModalOpen = ref(false)

// Utility untuk membuka dialog modal
const openModal = () => {
  isModalOpen.value = true;
}

// Utility untuk membuka dialog upload modal
const openUploadModal = () => {
  isUploadModalOpen.value = true;
}

// Utility untuk konversi folder ke TreeNode
const mapFolderToNode = (folder) => ({
  key: `D${folder.id}`,
  label: folder.name,
  icon: 'pi pi-folder',
  leaf: false,
  data: {
    ...folder,
    type: 'folder'
  }
})

// Utility untuk konversi file ke TreeNode
const mapFileToNode = (file) => ({
  key: `F${file.id}`,
  label: file.name,
  icon: 'pi pi-file',
  leaf: true,
  data: {
    ...file,
    type: 'file'
  }
})

// Fungsi untuk mengambil folder dari API
const fetchFolders = async (endpoint) => {
  try {
    const res = await fetch(endpoint)
    if (!res.ok) throw new Error(`Failed to fetch: ${endpoint}`)
    return await res.json()
  } catch (err) {
    console.error('Error fetching folders:', err)
    return []
  }
}

// Ambil data files dari endpoint tertentu
const fetchFiles = async (endpoint) => {
  try {
    const res = await fetch(endpoint)
    if (!res.ok) throw new Error(`Failed to fetch: ${endpoint}`)
    return await res.json()
  } catch (err) {
    console.error('Error fetching files:', err)
    return []
  }
}

// Saat komponen dimount, ambil root folders
onMounted(async () => {
  const rootFolders = await fetchFolders('/api/folders/root')
  const rootFiles = await fetchFiles('/api/files/root')
  nodes.value = [
    ...rootFolders.map(mapFolderToNode),
    ...rootFiles.map(mapFileToNode)
  ]
})

// Fungsi untuk menangani ekspansi node
const onNodeExpand = async (n) => {
  console.log("called")
  n.loading = true

  try {
    const [folders, files] = await Promise.all([
      fetchFolders(`/api/folders/parent/${n.data.id}`),
      fetchFiles(`/api/files/folder/${n.data.id}`)
    ])

    const folderNodes = folders.map(mapFolderToNode)
    const fileNodes = files.map(mapFileToNode)

    n.children = [...folderNodes, ...fileNodes]
  } catch (err) {
    console.error('Error on node expand:', err)
  } finally {
    n.loading = false
  }
}

// Fungsi untuk menangani pemilihan node
const onNodeSelect = (n) => {
  if (n.data.type === 'file') {
    window.open(`/api/files/${n.data.id}/stream`, '_blank')
    return
  }

  selectedKey.value = n.key
  if (expandedKeys.value[n.key]) {
    delete expandedKeys.value[n.key]
  } else {
    expandedKeys.value[n.key] = true
  }

  n.children = []
  
  onNodeExpand(n).then(() => {
    node.value = n
  })
}

const onNodeUnselect = (n) => {
  selectedKey.value = null
  node.value = null

  delete expandedKeys.value[n.key]
  if (n.children) {
    n.children = []
  }
}

// Fungsi untuk membuat folder baru
const newFolderName = ref('')
const createFolder = async () => {
  if (!newFolderName.value.trim()) {
    alert('Folder name cannot be empty')
    return
  }

  try {
    const res = await fetch('/api/folders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newFolderName.value, parentId: node.value ? node.value.data.id : null })
    })

    if (!res.ok) throw new Error('Failed to create folder')

    const newFolder = await res.json()
    // refresh the current node
    if (node.value) {
      const newNode = mapFolderToNode(newFolder)
      node.value.children.push(newNode)
      node.value.expanded = true
    } else {
      // If no node is selected, add to root
      nodes.value.push(mapFolderToNode(newFolder))
    }
  } catch (err) {
    console.error('Error creating folder:', err)
  } finally {
    isModalOpen.value = false
    newFolderName.value = ''
  }
}

const onAdvancedUpload = async (event) => {
  if (node.value) {
    onNodeExpand(node.value)
  } else {
    const rootFolders = await fetchFolders('/api/folders/root')
    const rootFiles = await fetchFiles('/api/files/root')
    nodes.value = [
      ...rootFolders.map(mapFolderToNode),
      ...rootFiles.map(mapFileToNode)
    ]
  }
}
</script>