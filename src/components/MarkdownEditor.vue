<template>
    <div ref="editor"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Vditor from 'vditor'
import "vditor/src/assets/less/index.less"
import { useBlogStore } from '../stores/blog'
import { useUserStore } from '../stores/user'

const blogStore = useBlogStore()
const userStore = useUserStore()

const editor = ref<HTMLElement | null>(null)
const contentEditor = ref<Vditor | null>(null);

let toolbar = [
    'emoji',
    'headings',
    'bold',
    'italic',
    'strike',
    'link',
    '|',
    'list',
    'ordered-list',
    'check',
    'outdent',
    'indent',
    '|',
    'quote',
    'line',
    'code',
    'inline-code',
    'insert-before',
    'insert-after',
    '|',
    'upload',
    // 'record',
    // 'table',
    '|',
    'undo',
    'redo',
    '|',
    'edit-mode',
    'content-theme',
    'code-theme',
    'export',
    {
        name: 'more',
        toolbar: [
            'fullscreen',
            'both',
            'preview',
            'info',
            'help',
        ],
    }
]

const editorId = () => {
    return 'vditor-' + blogStore.editBlogId
}

const initVditor = () => {
    contentEditor.value = new Vditor(editor.value, {
        toolbarConfig: {
            pin: true,
        },
        toolbar,
        cache: {
            enable: true,
            id: editorId
        },
        preview: {
            markdown: {
                toc: true,
                mark: true,
                autoSpace: true,
                fixTermTypo: true,
                chinesePunct: true,
            },
        },
        tab: '\t',
        upload: {
            accept: 'image/*',
            headers: {
                "X-Token": userStore.token,
            },
            url: 'http://localhost:8000/image/upload',
            multiple: false,
            fieldName: 'file',
            filename(name) {
                return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '').replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '').replace('/\\s/g', '')
            },
            format(files, responseText) {
                const res = JSON.parse(responseText)
                const name = files[0].name
                const url = res.url
                const result = JSON.stringify({
                    code: 0,
                    data: {
                        errFiles: [],
                        succMap: {
                            [name]: 'http://localhost:8000/image/'+url,
                        },
                    }
                })
                return result
            },
        },
        input(value: string) {
            blogStore.editBlogContent = value
        },
        after(){
            contentEditor.value.setValue(blogStore.editBlogContent);
        }
    })
}

onMounted(() => {
    initVditor()
    // update content
    // contentEditor.value.setValue(blogStore.editBlogContent)
})

onBeforeUnmount(() => {
    if (window.vditor) {
        window.vditor.destroy()
    }
})

</script>

<style scoped>
/* 添加一些样式以确保编辑器正确显示 */
div[ref="editor"] {
    height: 100%;
    min-height: fit-content;
}
</style>