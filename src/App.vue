<template>
  <div class="app">
    <CAMM />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CAMM from './components/CAMM.vue'

export default defineComponent({
  name: 'App',
  components: {
    CAMM
  }
})
</script>

<style>
/* Global styles */
</style>