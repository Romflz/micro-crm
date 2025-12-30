<script setup lang="ts">
import { ref, onMounted } from 'vue'

const message = ref('')

onMounted(async () => {
  const res = await fetch('/api/hello')
  const data = await res.json()
  message.value = data.message
})
</script>
<template>
  <div>
    <p>API response: {{ message }}</p>
    <RouterView />
  </div>
</template>
