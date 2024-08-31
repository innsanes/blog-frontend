<template>
    <div ref="editor"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Vditor from 'vditor'
import "vditor/src/assets/less/index.less"
import { useBlogStore } from '../stores/blog'

const blogStore = useBlogStore()

const editor = ref<HTMLElement | null>(null)

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

const initVditor = () => {
    window.vditor = new Vditor(editor.value, {
        value: blogStore.editBlogContent,
        toolbarConfig: {
            pin: true,
        },
        toolbar,
        cache: {
            enable: false,
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
            token: 'test',
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
    })
}

onMounted(() => {
    initVditor()
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