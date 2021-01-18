import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Register from '../components/Register.vue'
import Test from '../components/Test.vue'
import Cart from '../components/Cart/Cart.vue'
import Upload from '../components/upload.vue'
import UserInfo from '../components/UserInfo/UserInfo.vue'
import MyUserInfo from '../components/UserInfo/MyUserInfo.vue'
import ModifyUserInfo from '../components/UserInfo/ModifyUserInfo.vue'
import GoodDetail from '../components/GoodDetail.vue'
import Common from '../components/Common.vue'
import CarouselMap from '../components/CarouselMap.vue'
import CheckOrders from '../components/Cart/CheckOrders.vue'
import Address from '../components/Address/Address.vue'
import OrderSuccess from '../components/Cart/OrderSuccess.vue'
import TestCart from '../components/TestCart.vue'
import BackStage from '../components/BackStage/BackStage.vue'
import Myorders from '../components/Myorders.vue'
import ProductMan from '../components/BackStage/ProductMan.vue'
import OrderMan from '../components/BackStage/OrderMan.vue'
import UserMan from '../components/BackStage/UserMan.vue'
import Search from '../components/Search.vue'
import PaySuccess from '../components/Cart/PaySuccess.vue'
import { Form, FormItem, Input, Button } from 'element-ui'


Vue.use(VueRouter)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)



const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/home' },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/home/map',
      children: [
        {
          path: '/home/map',
          component: CarouselMap
        }
      ]
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/test',
      component: Test
    },
    {
      path: '/upload',
      component: Upload
    },
    {
      path: '/userInfo',
      component: UserInfo,
      redirect: '/myUserInfo',
      children: [
        {
          path: '/myUserInfo',
          component: MyUserInfo,
          children: [{
            path: '/myUserInfo',
            component: Upload
          }],
        },
        {
          path: '/modifyUserInfo',
          component: ModifyUserInfo
        },
        {
          path: '/address',
          component: Address
        },
        {
          path: '/back_stage',
          component: BackStage,
        }
      ]
    },
    {
      path: '/common',
      component: Common,
      redirect: '/common/goodDetail',
      children: [
        {
          path: '/common/goodDetail',
          component: GoodDetail,
        },
        {
          path: '/common/cart',
          component: Cart
        },
        {
          path: '/common/order',
          component: CheckOrders
        },
        {
          path: '/common/address',
          component: Address
        },
        {
          path: '/common/orderSuccess',
          component: OrderSuccess
        },
        {
          path: '/common/myorders',
          component: Myorders,
        },
        {
          path: '/common/paysuccess',
          component: PaySuccess,
        },
      ]
    },
    {
      path: '/map',
      component: CarouselMap
    },
    {
      path: '/Tcart',
      component: TestCart
    },
    {
      path: "/backStage",
      component: BackStage,
      redirect: '/backStage/product',
      children: [
        {
          path: '/backStage/product',
          component: ProductMan,
        },
        {
          path: '/backStage/order',
          component: OrderMan,
        },
        {
          path: '/backStage/user',
          component: UserMan,
        }
      ]
    },
    {
      path: '/search',
      component: Search,
    }

  ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to将要访问的路径
  //from代表从哪个路径来
  //next是一个函数,表示放行
  // if (to.path == '/login' || to.path == '/register') return next()
  if (to.path == '/common/cart') {
    //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) {
      return next('/login');
    }
  }
  else if (to.path == '/backStage' || to.path == '/backStage/product' || to.path == '/backStage/order' || to.path == '/backStage/user') {
    const userNameStr = window.sessionStorage.getItem('userName')
    if (userNameStr != 'admin') {
      return next('/home')
    }
  }

  next()
})

export default router
