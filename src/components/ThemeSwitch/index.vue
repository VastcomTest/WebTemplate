<script setup lang="ts">
import { useTheme } from 'vuetify'
import { computedWithControl, useCycleList } from '@vueuse/core';
import { watch } from 'vue';

const themes = [
  {
    name: 'light',
    icon: 'mdi-weather-sunny',
  },
  {
    name: 'dark',
    icon: 'mdi-weather-night',
  },
]

const vuetifyTheme = useTheme()
const { state: currentTheme, next: getNextThemeName, index: currentThemeIndex } 
= useCycleList(themes.map(t => t.name), { initialValue: vuetifyTheme.global.name.value })
const changeTheme = () => {
  vuetifyTheme.global.name.value = getNextThemeName()
}

const getThemeIcon = computedWithControl(vuetifyTheme.global.name, () => {
  const nextThemeIndex = currentThemeIndex.value + 1 === themes.length ? 0 : currentThemeIndex.value + 1

  return themes[nextThemeIndex].icon
})

watch(vuetifyTheme.global.name, val => {
  currentTheme.value = val
})
</script>

<template>
  <div style="width: 100%;">
    <v-btn
      class="theme-btn"
      style="width: 100%;border-radius: 20px;"
      :prepend-icon="getThemeIcon"
      @click="changeTheme"
    >
      {{ `${currentTheme} theme` }}
    </v-btn>
  </div>
</template>

<style lang="scss" scoped>
.theme-btn {
  color: rgb(var(--v-theme-primary));
}

</style>