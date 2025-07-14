<template>
    <div class="h-40 flex flex-col items-center justify-center bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer space-y-3 p-4 border border-zinc-700"
        @click="props.onNodeSelect(props.child)">
        <i :class="getStyle(child)['icon']" style="font-size: 2rem"></i>
        <span :class="getStyle(child)['text']" class="overflow-hidden text-ellipsis whitespace-nowrap w-full text-center">
            {{ child.data.name || child.label }}
        </span>
    </div>
</template>

<script setup>

const props = defineProps({
    child: {
        type: Object,
        required: true
    },
    onNodeSelect: {
        type: Function,
        required: true
    }
});

const getStyle = (child) => {
    if (child.data.mimeType && child.data.mimeType.startsWith('image/')) {
        return {
            icon: 'pi pi-image',
            text: 'text-sm font-semibold tracking-wide text-gray-300'
        };
    } else if (child.data.mimeType && child.data.mimeType.startsWith('video/')) {
        return {
            icon: 'pi pi-video',
            text: 'text-sm font-semibold tracking-wide text-gray-300'
        };
    } else if (child.data.mimeType && child.data.mimeType.startsWith('audio/')) {
        return {
            icon: 'pi pi-music',
            text: 'text-sm font-semibold tracking-wide text-gray-300'
        };
    } else if (child.data.mimeType && child.data.mimeType.includes('pdf')) {
        return {
            icon: 'pi pi-file-pdf text-red-400',
            text: 'text-sm font-semibold tracking-wide text-rose-400'
        };
    } else if (child.data.type === 'file') {
        return {
            icon: 'pi pi-file',
            text: 'text-sm font-semibold tracking-wide text-gray-300'
        };
    } else if (child.data.type === 'folder') {
        return {
            icon: 'pi pi-folder text-yellow-400',
            text: 'text-sm font-semibold tracking-wide text-yellow-400'
        };
    } else {
        return {
            icon: 'pi pi-question-circle',
            text: 'text-sm font-semibold tracking-wide text-gray-400'
        };
    }
};

</script>