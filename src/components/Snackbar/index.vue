<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState} from '@/hooks/useState';
import { useSnackBarStore } from '@/store/modules/snackbar'
import { storeToRefs } from 'pinia';
const { show , message , color , timeout } = storeToRefs(useSnackBarStore())
</script>
<template>
  <div class="text-center">
    <v-snackbar
      v-model="show"
      :timeout="timeout"
      color="secondary-container"
    >
      {{ message }}

      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style lang='scss' scoped>
.container{

}
</style>