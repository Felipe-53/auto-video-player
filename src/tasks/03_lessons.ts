import { ElementHandle } from 'puppeteer'
import ProxyPage from '../types/ProxyPage'

const selectors = {
  video: '#video-player_html5_api',
  nextVideo: '.task-menu-nav-item-link-VIDEO > .task-menu-nav-item-svg:not(.task-menu-nav-item-svg--done)',
  select: 'select.task-menu-sections-select'
}

export default function buildVideosPlayer(page: ProxyPage) {
  async function playAllVideos() {
    const lessons = await _getAllLessons()

    for (const lesson of lessons) {
      await page.evaluate(async (lesson, selectSelector) => {
        const selectEl = document.querySelector(selectSelector)
        selectEl.value = lesson
        selectEl.dispatchEvent(new Event('change'))
      }, lesson, selectors.select)

      await page.waitForNavigation({
        waitUntil: 'networkidle2'
      })

      if (!(await _isThereUnwatchedVideoOnCurrentLesson())) {
        continue
      } 

      await _goToNextUnwatchedVideo()
      await _playVideo()
    }
  }

  async function _playVideo() {
    await _playTheVideoAndWaitForItToFinish()
    if (await _isThereUnwatchedVideoOnCurrentLesson()) {
      await _goToNextUnwatchedVideo()
      await _playVideo()
    }
    return
  }

  let nextVideoLinkCache: ElementHandle
  async function _isThereUnwatchedVideoOnCurrentLesson() {
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

  async function _goToNextUnwatchedVideo() {
    await nextVideoLinkCache.click()
    await page.waitForNavigation({
      waitUntil: 'networkidle0'
    })
  }

  async function _playTheVideoAndWaitForItToFinish() {
    await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        const video = document.querySelector('#video-player_html5_api') as HTMLVideoElement
        if (!video) reject(new Error('Video not found'))
        video.play()
        video.addEventListener('ended', resolve)
      })
    })
  }

  async function _getAllLessons() {
    const lessons = await page.evaluate(async (selector) => {
      const selectEl = document.querySelector(selector)
      const options = Array.from(selectEl.options)
      // @ts-ignore
      return options.map(opt => opt.value)
    }, selectors.select)

    return lessons
  }

  return playAllVideos
}
