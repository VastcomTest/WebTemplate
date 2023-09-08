import { type RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router"

const Layouts = () => import("@/layouts/index.vue")

/** 常驻路由 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layouts,
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/result",
    component: () => import("@/views/result/index.vue"),
    meta: {
      hidden: true
    },
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path:'/',
    redirect:'userinfo',
    component:Layouts,
    children:[{
        path:'userinfo',
        component:()=>import("@/views/userInfo/index.vue"),
        name:"Home",
        meta:{
          title:'Home',
          elIcon:'User',
        }
      }
    ]
  },
  {
    path:'/',
    redirect:'timeline',
    component:Layouts,
    meta:{
      hidden:true

    },
    children:[{
        path:'timeline',
        component:()=>import("@/views/timeline/index.vue"),
        name:"timeline",
        meta:{
          title:'timeline',

        }
      }
    ]
  },
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [

  {
    path: "/",
    redirect:'/viewOfMyApplication',
    component: Layouts,
    meta:{
      roles:['admin','user'],
    },
    children: [
      {
        path: "viewOfMyApplication",
        component: () => import("@/views/application/user/index.vue"),
        name: "viewOfMyApplication",
        meta: {
          title: "View of my applications",
          svgIcon: "dashboard",
        }
      },
    ]
  },
  {
    path: "/",
    redirect:'/applicationForFO',
    component: Layouts,
    meta:{
      roles:['FO'],
    },
    children: [
      {
        path: "applicationForFO",
        component: () => import("@/views/application/fo/index.vue"),
        name: "applicationForFO",
        meta: {
          title: "Application",
          svgIcon: "dashboard",
        }
      },
    ]
  },
  {
    path: "/",
    name: "Application",
    redirect:'/application/index',
    component: Layouts,
    meta:{
      title: "application",
      svgIcon: "dashboard",
      roles:['approver'],
    },
    children: [
      {
        path: "application",
        component: () => import("@/views/application/approver/index.vue"),
        name: "ApplicationIndex",
        meta: {
          title: "application",
          svgIcon: "dashboard",
        }
      },
    ]
  },
  {
    path: "/form",
    component: Layouts,
    //redirect: "/table/element-plus",
    name: "Form",
    meta: {
      title: "Form",
      elIcon: "Grid",
      roles:['admin','user']
    },
    children: [
      {
        path: "goodOrService",
        component: () => import("@/views/table/GoodOrService/index.vue"),
        name: "GoodOrService",
        meta: {
          title: "Good / Service",
          keepAlive: true
        }
      },
      {
        path: "trip",
        component: () => import("@/views/table/Trip/index.vue"),
        name: "Trip",
        meta: {
          title: "Trip",
          keepAlive: true
        }
      },
      {
        path: "stipend",
        component: () => import("@/views/table/Stipend/index.vue"),
        name: "Stipend",
        meta: {
          title: "Stipend",
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/",
    redirect:'/applicationReview',
    component:Layouts,
    meta:{
      hidden:true,
      roles:['user']
    },
    children:[{
        path:'applicationReview',
        component:()=>import("@/views/applicationReview/user/index.vue"),
        name:"applicationReview",
        meta:{
          title:'Application Review',
        }
      }
    ]
  },
  {
    path: "/",
    redirect:'/approve',
    component:Layouts,
    meta:{
      roles:['approver'],
      hidden:true
    },
    children:[{
      path:'approve',
        component:()=>import("@/views/applicationReview/approver/index.vue"),
        name:"approve",
        meta:{
          title:'Approve',
        }
      }
    ]
  },
  {
    path: "/",
    redirect:'/approveForFO',
    component:Layouts,
    meta:{
      roles:['FO'],
      hidden:true
    },
    children:[{
        path:'approveForFO',
        component:()=>import("@/views/applicationReview/fo/index.vue"),
        name:"approve",
        meta:{
          title:'Approve',
        }
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*", // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
    redirect: "/404",
    name: "ErrorPage",
    meta: {
      hidden: true
    }
  }
]

const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === "hash"
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
