import ProxyPage from "../types/ProxyPage"

const selectors = {
  courseBtn: 'a.big-card__right-button'
}

function buildGoToCourse(page: ProxyPage) {
  return async function() {
    const button = await page.$(selectors['courseBtn'])
    await button.click()

    await page.waitForNavigation({
      waitUntil: 'networkidle2'
    })
  }
}

export default buildGoToCourse
