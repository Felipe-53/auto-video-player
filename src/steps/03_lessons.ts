import { ElementHandle } from 'puppeteer'
import ProxyPage from '../types/ProxyPage'

const selectors = {
  video: '#video-player_html5_api',
  nextVideo: '.task-menu-nav-item-link-VIDEO > .task-menu-nav-item-svg:not(.task-menu-nav-item-svg--done)',
  select: 'select.task-menu-sections-select'
}

export default function buildVideosPlayer(page: ProxyPage) {
  async function playAllVideos() {
    const lessons = await page.evaluate(async (selector) => {
      const selectEl = document.querySelector(selector)
      const options = Array.from(selectEl.options)
      // @ts-ignore
      return options.map(opt => opt.value)
    }, selectors.select)

    for (const lesson of lessons) {
      await page.evaluate(async (lesson, selectSelector) => {
        const selectEl = document.querySelector(selectSelector)
        selectEl.value = lesson
        selectEl.dispatchEvent(new Event('change'))
      }, lesson, selectors.select)

      await page.waitForNavigation({
        waitUntil: 'networkidle2'
      })

      if (!(await isThereNextVideoOnCurrentLesson())) {
        continue
      } 

      await goToNextVideo()
      await playVideo()
    }
  }

  async function playVideo() {
    await playTheVideoAndWaitForItToFinish()
    if (await isThereNextVideoOnCurrentLesson()) {
      await goToNextVideo()
      await playVideo()
    }
    return
  }

  let nextVideoLinkCache: ElementHandle
  async function isThereNextVideoOnCurrentLesson() {
    const nextVideoLinkJSHandle = await page.evaluateHandle(async (selector) => {
      const next = document.querySelector(selector)?.parentElement
      return next
    }, selectors.nextVideo)
  
    if (!nextVideoLinkJSHandle) return false
  
    const nextVideoLink = nextVideoLinkJSHandle.asElement()
    if (!nextVideoLink) return false

    // side-effect: not ideal, but will save some code
    nextVideoLinkCache = nextVideoLink
    return true
  }

  async function goToNextVideo() {
    await nextVideoLinkCache.click()
    await page.waitForNavigation({
      waitUntil: 'networkidle2'
    })
  }

  async function playTheVideoAndWaitForItToFinish() {
    await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        const video = document.querySelector('#video-player_html5_api') as HTMLVideoElement
        if (!video) reject(new Error('Video not found'))
        video.play()
        video.addEventListener('ended', resolve)
      })
    })
  }

  return playAllVideos
}
