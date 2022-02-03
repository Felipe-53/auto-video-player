import buildLogin from '../tasks/01_login'
import buildGoToCourse from '../tasks/02_course'
import buildLessonsPlayer from '../tasks/03_lessons'
import ProxyPage from '../types/ProxyPage'
import delay from '../utils/delay'


function buildTaskManager(page: ProxyPage) {
  const tasks: {(): Promise<void>}[] = []

  tasks.push(buildLogin(page))
  tasks.push(buildGoToCourse(page))
  tasks.push(buildLessonsPlayer(page))

  async function run() {
    for (const task of tasks) {
      await task()
      await delay(1000)
    }
  }

  return {
    run,
  }
}

export default buildTaskManager
