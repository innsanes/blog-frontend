import type { DefaultTheme } from 'vitepress/theme'
import { onMounted, onUnmounted, onUpdated, type Ref } from 'vue'

const SCROLL_OFFSET = 60; // 您可以根据实际导航栏高度调整此值

const ignoreRE = /\b(?:VPBadge|header-anchor|footnote-ref|ignore-header)\b/

// cached list of anchor elements from resolveHeaders
const resolvedHeaders: { element: HTMLHeadElement; link: string }[] = []

// 3. 为 useActiveAnchor 的初始化逻辑添加全局标记
const OUTLINE_INITIALIZED_KEY = '__OUTLINE_INITIALIZED__'

export function resolveTitle(theme: DefaultTheme.Config): string {
  return (
    (typeof theme.outline === 'object' &&
      !Array.isArray(theme.outline) &&
      theme.outline.label) ||
    theme.outlineTitle ||
    'On this page'
  )
}

export function getHeaders(
  range: DefaultTheme.Config['outline']
): OutlineItem[] {
  const headers = [
    ...document.querySelectorAll('.VPDoc :where(h1,h2,h3,h4,h5,h6)')
  ]
    .filter((el) => el.id && el.hasChildNodes())
    .map((el) => {
      const level = Number(el.tagName[1])
      return {
        element: el as HTMLHeadElement,
        title: serializeHeader(el),
        link: '#' + el.id,
        level
      }
    })

  return resolveHeaders(headers, range)
}

function serializeHeader(h: Element): string {
  let ret = ''
  for (const node of h.childNodes) {
    if (node.nodeType === 1) {
      if (ignoreRE.test((node as Element).className)) continue
      ret += node.textContent
    } else if (node.nodeType === 3) {
      ret += node.textContent
    }
  }
  return ret.trim()
}

export function resolveHeaders(
  headers: OutlineItem[],
  range?: DefaultTheme.Config['outline']
): OutlineItem[] {
  if (range === false) {
    return []
  }

  const levelsRange =
    (typeof range === 'object' && !Array.isArray(range)
      ? range.level
      : range) || 2

  const [high, low]: [number, number] =
    typeof levelsRange === 'number'
      ? [levelsRange, levelsRange]
      : levelsRange === 'deep'
        ? [2, 6]
        : levelsRange

  return buildTree(headers, high, low)
}

export function useActiveAnchor(
  container: Ref<HTMLElement>,
  marker: Ref<HTMLElement>
): void {
  const onScroll = throttleAndDebounce(setActiveLink, 100)

  let prevActiveLink: HTMLAnchorElement | null = null

  // 确保 onMounted 的逻辑只执行一次
  if (typeof window !== 'undefined' && !(window as any)[OUTLINE_INITIALIZED_KEY]) {
    (window as any)[OUTLINE_INITIALIZED_KEY] = true

    onMounted(() => {
      requestAnimationFrame(setActiveLink)
      window.addEventListener('scroll', onScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', onScroll)
      // 可选：如果希望在组件卸载时重置初始化标记（例如，如果 useActiveAnchor 可能在不同实例中多次使用且需要重新初始化）
      // delete (window as any)[OUTLINE_INITIALIZED_KEY]
    })
  }

  onUpdated(() => {
    // sidebar update means a route change
    activateLink(location.hash)
  })

  function setActiveLink() {
    const scrollY = window.scrollY
    const innerHeight = window.innerHeight
    const offsetHeight = document.body.offsetHeight
    const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1

    // resolvedHeaders may be repositioned, hidden or fix positioned
    const headers = resolvedHeaders
      .map(({ element, link }) => ({
        link,
        top: getAbsoluteTop(element)
      }))
      .filter(({ top }) => !Number.isNaN(top))
      .sort((a, b) => a.top - b.top)

    // no headers available for active link
    if (!headers.length) {
      activateLink(null)
      return
    }

    // page top
    if (scrollY < 1) {
      activateLink(null)
      return
    }

    // page bottom - highlight last link
    if (isBottom) {
      activateLink(headers[headers.length - 1].link)
      return
    }

    // find the last header above the top of viewport
    let activeLink: string | null = null
    for (const { link, top } of headers) {
      if (top > scrollY + SCROLL_OFFSET + 4) {
        break
      }
      activeLink = link
    }
    activateLink(activeLink)
  }

  function activateLink(hash: string | null) {
    if (prevActiveLink) {
      prevActiveLink.classList.remove('active')
    }

    if (hash == null) {
      prevActiveLink = null
    } else {
      prevActiveLink = container.value?.querySelector(
        `a[href="${decodeURIComponent(hash)}"]`
      ) as HTMLAnchorElement | null
    }

    const activeLink = prevActiveLink

    if (activeLink && marker.value) { // 确保 marker.value 存在
      activeLink.classList.add('active')
      marker.value.style.top = activeLink.offsetTop + 39 + 'px'
      marker.value.style.opacity = '1'
    } else if (marker.value) { // 确保 marker.value 存在
      marker.value.style.top = '33px'
      marker.value.style.opacity = '0'
    }
  }
}

function getAbsoluteTop(element: HTMLElement | null): number { // 允许 element 为 null
  let offsetTop = 0
  while (element && element !== document.body) { // 检查 element 是否为 null
    if (element === null) {
      return NaN
    }
    offsetTop += element.offsetTop
    element = element.offsetParent as HTMLElement
  }
  return offsetTop
}

function buildTree(
  data: OutlineItem[],
  min: number,
  max: number
): OutlineItem[] {
  resolvedHeaders.length = 0
  const result: OutlineItem[] = []
  const stack: (
    | (OutlineItem & { children: OutlineItem[] }) // 确保 parent 有 children 属性
    | { level: number; shouldIgnore: true }
  )[] = []

  data.forEach((item) => {
    const node = { ...item, children: [] as OutlineItem[] } // 确保 node 有 children
    let parent = stack[stack.length - 1] as (OutlineItem & { children: OutlineItem[] }) | { level: number; shouldIgnore: true } | undefined

    while (parent && parent.level >= node.level) {
      stack.pop()
      parent = stack[stack.length - 1] as (OutlineItem & { children: OutlineItem[] }) | { level: number; shouldIgnore: true } | undefined
    }

    if (
      node.element.classList.contains('ignore-header') ||
      (parent && 'shouldIgnore' in parent && parent.shouldIgnore)
    ) {
      stack.push({ level: node.level, shouldIgnore: true })
      return
    }

    if (node.level > max || node.level < min) return
    resolvedHeaders.push({ element: node.element, link: node.link })

    if (parent && !('shouldIgnore' in parent)) { // 确保 parent 不是 shouldIgnore 对象
      parent.children!.push(node)
    } else {
      result.push(node)
    }
    stack.push(node)
  })

  return result
}

export type OutlineItem = Omit<Header, 'slug' | 'children'> & {
    element: HTMLHeadElement
    children?: OutlineItem[]
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
  

export function throttleAndDebounce(fn: () => void, delay: number): () => void {
  let timeoutId: number
  let called = false

  return () => {
    if (timeoutId) clearTimeout(timeoutId)

    if (!called) {
      fn()
      called = true;
      setTimeout(() => { called = false }, delay)
    } else {
      timeoutId = setTimeout(fn, delay) as unknown as number
    }
  }
}