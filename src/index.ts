import puppeteer from 'puppeteer'
import buildController from './controller/controller'
import SelectorNotFoundError from './errors/SelectorNotFoundError'
import delay from './utils/delay'
import env from './config/env'
import ProxyPage from './types/ProxyPage'

const { platformUrl } = env

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:  '/usr/bin/google-chrome'
  })

  const [page] = await browser.pages()

  const proxyPage = new Proxy(page, {
    get: function(target, property, reciever) {
      if (property === '$') {
        return async function(selector: string) {
          const elementHandle = await target.$(selector)
          if (!elementHandle) throw new SelectorNotFoundError(selector)
          return elementHandle
        }
      }

      return Reflect.get(target, property, reciever)
    }
  })

  await proxyPage.goto(platformUrl, {
    waitUntil: 'networkidle2'
  })
  
  // @ts-ignore
  const controller = buildController(proxyPage)

  for (const action of controller) {
    await action()
    await delay(1000)
  }

  await browser.close()
  console.log('Wow, you just did all of your course, go take 5')
}

main().catch(err => {
  console.log(err)
  process.exit(1)
})
