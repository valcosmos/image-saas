<template>
  <div>

  </div>
</template>

<script setup lang="ts">
import { createApiClient } from '@image-saas/api'

// const apiKey = 'a06950db-5cc2-4a53-b8e5-5f53fccf7777'


onMounted(async () => { 
  const tokenResp = await fetch('/api/test')
  const token = await tokenResp.text()
  const apiClient = createApiClient({ signedToken: token })

   apiClient.file.createPresignedUrl.mutate({
    filename: 'demo.png',
    contentType: 'image/png',
    size: 74473,
    appId: '1c10309e-7897-4190-998d-128b4a5b0638',
  })
})



</script>

