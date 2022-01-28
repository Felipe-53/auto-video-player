import buildLogin from '../steps/01_login'
import buildGoToCourse from '../steps/02_course'
import buildLessonsPlayer from '../steps/03_lessons'
import ProxyPage from '../types/ProxyPage'

function buildController(page: ProxyPage) {
  const actions = []
  actions.push(buildLogin(page))
  actions.push(buildGoToCourse(page))
  actions.push(buildLessonsPlayer(page))

  return actions
}

export default buildController
