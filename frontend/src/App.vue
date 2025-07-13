<template>
  <Splitter style="height: 100svh">
    <SplitterPanel class="flex justify-center" :size="15" :minSize="15">
      <ScrollPanel class="w-full h-full">
        <Tree 
          selectionMode="single" 
          class="w-full" 
          loadingMode="icon"
          v-model:selectionKeys="selectedKey"
          v-model:expandedKeys="expandedKeys"
          :value="nodes"
          @nodeExpand="onNodeExpand" 
          @nodeCollapse="onNodeCollapse"
          @nodeSelect="onNodeSelect"
          @nodeUnselect="onNodeUnselect"
        >
          <template #default="slotProps">
            <a v-if="slotProps.node.data.type === 'file'" :href="`/api/files/${slotProps.node.data.id}/stream`" target="_blank">
              {{ slotProps.node.label }}
            </a>
            <span v-else>
              {{ slotProps.node.label }}
            </span>
          </template>
        </Tree>
      </ScrollPanel>
    </SplitterPanel>
    <SplitterPanel :size="85" :minSize="60">
      <Splitter layout="vertical">
        <SplitterPanel class="flex items-center justify-center" :size="6" :minSize="6"> Panel 2 </SplitterPanel>
        <SplitterPanel class="flex items-center justify-center" :size="94" :minSize="94"> Panel 4 </SplitterPanel>
      </Splitter>
    </SplitterPanel>
  </Splitter>
  <Toast />
</template>

<script setup>
import { onMounted, ref } from 'vue'

const selectedKey = ref(null)
const expandedKeys = ref({});
const nodes = ref([])

/**
 * Utility untuk konversi folder ke TreeNode
 */
const mapFolderToNode = (folder) => ({
  key: Number(folder.id),
  label: folder.name,
  icon: 'pi pi-folder',
  leaf: false,
  data: {
    id: folder.id,
    name: folder.name,
    type: 'folder'
  }
})

/**
 * Utility untuk konversi file ke TreeNode
 */
const mapFileToNode = (file) => ({
  key: Number(file.id),
  label: file.name,
  icon: 'pi pi-file',
  leaf: true,
  data: {
    id: file.id,
    name: file.name,
    type: 'file'
  }
})

/**
 * Ambil data folders dari endpoint tertentu
 */
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

/**
 * Ambil data files dari endpoint tertentu
 */
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
  nodes.value = rootFolders.map(mapFolderToNode)
})

/**
 * Saat node folder di-expand
 */
const onNodeExpand = async (node) => {
  node.loading = true

  try {
    const [folders, files] = await Promise.all([
      fetchFolders(`/api/folders/parent/${node.key}`),
      fetchFiles(`/api/files/folder/${node.key}`)
    ])

    const folderNodes = folders.map(mapFolderToNode)
    const fileNodes = files.map(mapFileToNode)

    node.children = [...folderNodes, ...fileNodes]
    console.log('Node expanded:', node)
  } catch (err) {
    console.error('Error on node expand:', err)
  } finally {
    node.loading = false
  }
}

const onNodeCollapse = (node) => {
  // console.log('Node collapsed:', node)
}

const onNodeSelect = (node) => {
  if (node.data.type === 'file') {
    window.open(`/api/files/${node.data.id}/stream`, '_blank')
  } else if (node.data.type === 'folder') {
    if (!expandedKeys.value[node.key]) {
      expandedKeys.value[node.key] = true
      onNodeExpand(node)
    }
  }
}

const onNodeUnselect = (node) => {
  if (node.data.type === 'folder') {
    if (expandedKeys.value[node.key]) {
      expandedKeys.value[node.key] = false
      onNodeExpand(node)
    }
  }
}
</script>