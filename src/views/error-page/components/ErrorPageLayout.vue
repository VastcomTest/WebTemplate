<template>
  <div class="error-page">
    <div class="error-page-svg">
      <slot />
    </div>
    <router-link to="/">
      <v-btn color="primary">Back</v-btn>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgb(var(--v-theme-surface));
  &-svg {
    width: 400px;
    margin-bottom: 50px;
  }
}
</style>
