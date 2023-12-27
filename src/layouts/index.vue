<script lang="ts" setup>
import { computed, watchEffect } from "vue"
import { storeToRefs } from "pinia"
import { useAppStore } from "@/store/app"
import { useSettingsStore } from "@/store/settings"
import useResize from "./hooks/useResize"
import LeftMode from "./LeftMode.vue"
import TopMode from "./TopMode.vue"
import LeftTopMode from "./LeftTopMode.vue"
import { Settings, RightPanel } from "./components"
import { DeviceEnum } from "@/constants/app-key"
import { getCssVariableValue, setCssVariableValue } from "@/utils"

/** Layout 布局响应式 */
useResize()

const appStore = useAppStore()
const settingsStore = useSettingsStore()

const { showSettings, layoutMode, showTagsView, showGreyMode, showColorWeakness } = storeToRefs(settingsStore)

const classes = computed(() => {
  return {
    showGreyMode: showGreyMode.value,
    showColorWeakness: showColorWeakness.value
  }
})

//#region 隐藏标签栏时删除其高度，是为了让 Logo 组件高度和 Header 区域高度始终一致
const cssVariableName = "--v3-tagsview-height"
const v3TagsviewHeight = getCssVariableValue(cssVariableName)
watchEffect(() => {
  showTagsView.value
    ? setCssVariableValue(cssVariableName, v3TagsviewHeight)
    : setCssVariableValue(cssVariableName, "0px")
})
//#endregion
</script>

<template>
  <div style="height: 100%;width: 100%;" >
    <!-- 左侧模式 -->
    <LeftMode v-if="layoutMode === 'left' || appStore.device === DeviceEnum.Mobile" />
    <!-- <TopMode v-else-if="layoutMode === 'top'" />
    <LeftTopMode v-else-if="layoutMode === 'left-top'" />
    <RightPanel v-if="showSettings">
      <Settings />
    </RightPanel> -->
  </div>
</template>

<style lang="scss" scoped>
.showGreyMode {
  filter: grayscale(1);
}

.showColorWeakness {
  filter: invert(0.8);
}
</style>
