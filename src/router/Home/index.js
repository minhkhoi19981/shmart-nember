import { lazy } from 'react'

const pathHome = {
  home: '/home'
}

const navigateHome = [
  {
    name: 'Home',
    path: pathHome.home,
    component: lazy(() => import('../../page/Home/index.js'))
  }
]

export default navigateHome
