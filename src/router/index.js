import Vue from 'vue'
import Router from 'vue-router'
import { routes} from './routes'
import { changeTitle } from '@/util'

Vue.use(Router)

const router = new Router({
  routes
})

router.afterEach(route => {
  changeTitle(route.meta.title)
})

export default router
