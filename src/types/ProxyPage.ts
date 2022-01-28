import { ElementHandle, Page } from 'puppeteer'

interface ProxyPage extends Page {
  $: (selector: string) => Promise<ElementHandle<Element>>
}

export default ProxyPage
