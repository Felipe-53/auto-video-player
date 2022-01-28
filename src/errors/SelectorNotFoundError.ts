export default class SelectorNotFoundError extends Error {
  constructor(selector: string) {
    const message = `The selector '${selector}' was not found`
    super(message)
  }
}