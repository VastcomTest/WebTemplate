<script lang="ts" setup>
import { h } from "vue"
import { useTheme } from "@/hooks/useTheme"
import { resetConfigLayout } from "@/utils"
import { ElNotification } from "element-plus"
// 将 Element Plus 的语言设置为中文
import zhCn from "element-plus/es/locale/lang/zh-cn"
// @ts-ignore
import SnackBar from '@/components/SnackBar/index.vue'
// const { initTheme } = useTheme()

// /** 初始化主题 */
// initTheme()

</script>

<template>
  <SnackBar/>
  <VApp>
    <VLayout class="layout-wrapper layout-nav-type-vertical">
      <RouterView />
    </VLayout>
  </VApp>
</template>
