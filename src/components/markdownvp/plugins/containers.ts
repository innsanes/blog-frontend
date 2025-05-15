import type { MarkdownItAsync } from 'markdown-it-async'
import container from 'markdown-it-container'
import type { RenderRule } from 'markdown-it/lib/renderer.mjs'
import type Token from 'markdown-it/lib/token.mjs'
import { extractTitle } from './preWrapper'

export const containerPlugin = (
  md: MarkdownItAsync,
  options?: ContainerOptions
) => {
  md.use(...createContainer('tip', options?.tipLabel || 'TIP', md))
    .use(...createContainer('info', options?.infoLabel || 'INFO', md))
    .use(...createContainer('warning', options?.warningLabel || 'WARNING', md))
    .use(...createContainer('danger', options?.dangerLabel || 'DANGER', md))
    .use(...createContainer('details', options?.detailsLabel || 'Details', md))
    // explicitly escape Vue syntax
    .use(container, 'v-pre', {
      render: (tokens: Token[], idx: number) =>
        tokens[idx].nesting === 1 ? `<div v-pre>\n` : `</div>\n`
    })
    .use(container, 'raw', {
      render: (tokens: Token[], idx: number) =>
        tokens[idx].nesting === 1 ? `<div class="vp-raw">\n` : `</div>\n`
    })
    .use(...createCodeGroup(md))
}

type ContainerArgs = [typeof container, string, { render: RenderRule }]

function createContainer(
  klass: string,
  defaultTitle: string,
  md: MarkdownItAsync
): ContainerArgs {
  return [
    container,
    klass,
    {
      render(tokens, idx, _options, env: MarkdownEnv & { references?: any }) {
        const token = tokens[idx]
        if (token.nesting === 1) {
          token.attrJoin('class', `${klass} custom-block`)
          const attrs = md.renderer.renderAttrs(token)
          const info = token.info.trim().slice(klass.length).trim()
          const title = md.renderInline(info || defaultTitle, {
            references: env.references
          })
          const titleClass =
            'custom-block-title' + (info ? '' : ' custom-block-title-default')
          if (klass === 'details')
            return `<details ${attrs}><summary>${title}</summary>\n`
          return `<div ${attrs}><p class="${titleClass}">${title}</p>\n`
        } else return klass === 'details' ? `</details>\n` : `</div>\n`
      }
    }
  ]
}

function createCodeGroup(md: MarkdownItAsync): ContainerArgs {
  return [
    container,
    'code-group',
    {
      render(tokens, idx) {
        if (tokens[idx].nesting === 1) {
          let tabs = ''
          let checked = 'checked'

          for (
            let i = idx + 1;
            !(
              tokens[i].nesting === -1 &&
              tokens[i].type === 'container_code-group_close'
            );
            ++i
          ) {
            const isHtml = tokens[i].type === 'html_block'

            if (
              (tokens[i].type === 'fence' && tokens[i].tag === 'code') ||
              isHtml
            ) {
              const title = extractTitle(
                isHtml ? tokens[i].content : tokens[i].info,
                isHtml
              )

              if (title) {
                tabs += `<input type="radio" name="group-${idx}" id="tab-${i}" ${checked}><label data-title="${md.utils.escapeHtml(title)}" for="tab-${i}">${title}</label>`

                if (checked && !isHtml) tokens[i].info += ' active'
                checked = ''
              }
            }
          }

          return `<div class="vp-code-group"><div class="tabs">${tabs}</div><div class="blocks">\n`
        }
        return `</div></div>\n`
      }
    }
  ]
}

export interface ContainerOptions {
  infoLabel?: string
  noteLabel?: string
  tipLabel?: string
  warningLabel?: string
  dangerLabel?: string
  detailsLabel?: string
  importantLabel?: string
  cautionLabel?: string
}

/**
 * SFC block extracted from markdown
 */
export interface SfcBlock {
  /**
   * The type of the block
   */
  type: string
  /**
   * The content, including open-tag and close-tag
   */
  content: string
  /**
   * The content that stripped open-tag and close-tag off
   */
  contentStripped: string
  /**
   * The open-tag
   */
  tagOpen: string
  /**
   * The close-tag
   */
  tagClose: string
}

export interface MarkdownSfcBlocks {
  /**
   * The `<template>` block
   */
  template: SfcBlock | null
  /**
   * The common `<script>` block
   */
  script: SfcBlock | null
  /**
   * The `<script setup>` block
   */
  scriptSetup: SfcBlock | null
  /**
   * All `<script>` blocks.
   *
   * By default, SFC only allows one `<script>` block and one `<script setup>` block.
   * However, some tools may support different types of `<script>`s, so we keep all of them here.
   */
  scripts: SfcBlock[]
  /**
   * All `<style>` blocks.
   */
  styles: SfcBlock[]
  /**
   * All custom blocks.
   */
  customBlocks: SfcBlock[]
}

// Manually declaring all properties as rollup-plugin-dts
// is unable to merge augmented module declarations
export interface MarkdownEnv {
  /**
   * The raw Markdown content without frontmatter
   */
  content?: string
  /**
   * The excerpt that extracted by `@mdit-vue/plugin-frontmatter`
   *
   * - Would be the rendered HTML when `renderExcerpt` is enabled
   * - Would be the raw Markdown when `renderExcerpt` is disabled
   */
  excerpt?: string
  /**
   * The frontmatter that extracted by `@mdit-vue/plugin-frontmatter`
   */
  frontmatter?: Record<string, unknown>
  /**
   * The headers that extracted by `@mdit-vue/plugin-headers`
   */
  headers?: Header[]
  /**
   * SFC blocks that extracted by `@mdit-vue/plugin-sfc`
   */
  sfcBlocks?: MarkdownSfcBlocks
  /**
   * The title that extracted by `@mdit-vue/plugin-title`
   */
  title?: string
  path: string
  relativePath: string
  cleanUrls: boolean
  links?: string[]
  includes?: string[]
  realPath?: string
  localeIndex?: string
}

export interface Header {
  /**
   * The level of the header
   *
   * `1` to `6` for `<h1>` to `<h6>`
   */
  level: number
  /**
   * The title of the header
   */
  title: string
  /**
   * The slug of the header
   *
   * Typically the `id` attr of the header anchor
   */
  slug: string
  /**
   * Link of the header
   *
   * Typically using `#${slug}` as the anchor hash
   */
  link: string
  /**
   * The children of the header
   */
  children: Header[]
}