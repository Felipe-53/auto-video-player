import assert from 'assert'
import { config } from 'dotenv'
import { resolve } from 'path'

const REQUIRED_ENV_KEYS = ['LOGIN', 'PASSWORD', 'PLATFORM_URL']

const result = config({
  path: resolve(__dirname, '../../.env')
})

if (!result.parsed) {
  throw Error('Faild to load .env file')
} 

const parsedKeys = Object.keys(result.parsed)

REQUIRED_ENV_KEYS.forEach(key => {
  assert(parsedKeys.includes(key))
})

const env = {
  login: result.parsed.LOGIN,
  password: result.parsed.PASSWORD,
  platformUrl: result.parsed.PLATFORM_URL
}

export default env
