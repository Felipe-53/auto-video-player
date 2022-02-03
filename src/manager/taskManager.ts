import buildLogin from '../steps/01_login'
import buildGoToCourse from '../steps/02_course'
import buildLessonsPlayer from '../steps/03_lessons'
import ProxyPage from '../types/ProxyPage'
import delay from '../utils/delay'


function buildTaskManager(page: ProxyPage) {
  const actions: {(): Promise<void>}[] = []

  actions.push(buildLogin(page))
  actions.push(buildGoToCourse(page))
  actions.push(buildLessonsPlayer(page))

  async function run() {
    for (const action of actions) {
      await action()
      await delay(1000)
    }
  }

  return {
    run,
  }
}

export default buildTaskManager
