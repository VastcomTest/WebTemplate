import { type RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router"
import { LoginCallback, navigationGuard } from '@okta/okta-vue'
import ProfileComponent from '@/components/Profile/index.vue'
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
    path: '/login/callback',
    meta:{
      hidden: true
    },
    component: LoginCallback
  },
  {
    path: '/profile',
    component: ProfileComponent,
    meta:{
      hidden: true
    },
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
    path: "/pdf",
    component: () => import("@/views/pdf/index.vue"),
    meta: {
      hidden: true
    }
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
    redirect:'/admin/user',
    component:Layouts,
    meta:{
      sectionTitle:"Membership"
    },
    children:[{
        path:'userinfo',
        component:()=>import("@/views/userInfo/index.vue"),
        name:"Home",
        meta:{
          mdiIcon:'mdi-history'
        }
      }
    ]
  },
  {
    path:'/admin',
    component:Layouts,
    redirect: '/admin/group',
    meta:{
      sectionTitle:"Management"
    },
    children:[
      {
        path:'user',
        component: ()=>import("@/views/admin/userManagement/index.vue"),
        name:"User",
        meta:{
          mdiIcon:'mdi-account-cog'
        }
      },
      {
        path:'group',
        component: ()=>import("@/views/admin/groupManagement/index.vue"),
        name:"Group",
        meta:{
          mdiIcon:'mdi-account-group'
        }
      },
      {
        path:'role',
        component: ()=>import("@/views/admin/roleManagement/index.vue"),
        name:"Role",
        meta:{
          mdiIcon:'mdi-badge-account'
        }
      },
      {
        path:'setting',
        component: ()=>import("@/views/admin/setting/index.vue"),
        name:"Setting",
        meta:{
          mdiIcon:'mdi-cog'
        }
      },
    ]
  },
  // {
  //   path:'/group',
  //   redirect: '/group/index',
  //   component:Layouts,
  //   children:[{
  //     path:'index',
  //     component: ()=>import("@/views/admin/groupManagement/index.vue"),
  //     name:"Group",
  //     meta:{
  //       title:"Group",
  //       svgIcon: "unocss"
  //     }
  //   }]
  // },
  // {
  //   path:'/',
  //   component:Layouts,
  //   children:[{
  //     path:'Role',
  //     component: ()=>import("@/views/admin/roleManagement/index.vue"),
  //     name:"Role",
  //     meta:{
  //       title:"Role",
  //       svgIcon: "dashboard"
  //     }
  //   }]
  // },
  // {
  //   path:'/',
  //   component:Layouts,
  //   children:[{
  //     path:'User',
  //     component: ()=>import("@/views/admin/userManagement/index.vue"),
  //     name:"User",
  //     meta:{
  //       title:"User",
  //       svgIcon: "menu"
  //     }
  //   }]
  // },
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  
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
