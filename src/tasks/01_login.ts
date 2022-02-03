import env from '../config/env'
import ProxyPage from '../types/ProxyPage'

const selectors = {
  login: '#login-email',
  password: '#password',
  submitBtn: '.btn-login'
}

function buildLogin(page: ProxyPage) {
  return async function login() {
    const login = await page.$(selectors.login)
    await login.type(env.login)
  
    const password = await page.$(selectors.password)
    await password.type(env.password)
  
    const submitBtn = await page.$(selectors.submitBtn)
    await submitBtn.click()

    await page.waitForNavigation()
  }
}


export default buildLogin
