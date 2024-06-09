<script setup lang="ts">
import { createApiClient } from '@image-saas/api'
import { UploadButton } from '@image-saas/upload-button'
import { h, render } from 'preact'
import { connect } from '@image-saas/preact-vue-connect'
import { createUploader } from '@image-saas/uploader'
// const apiKey = 'a06950db-5cc2-4a53-b8e5-5f53fccf7777'
const containerRef = ref()
// watchEffect(() => {
//   if(containerRef.value)render(h(UploadButton), containerRef.value)
// })

const VueUploadButton = connect(UploadButton)

onMounted(async () => {

})

const uploader = createUploader(async (file) => {
  const tokenResp = await fetch('/api/test')
  const token = await tokenResp.text()
  const apiClient = createApiClient({ signedToken: token })
  //  return apiClient.file.createPresignedUrl.mutate({
  //     filename: 'demo.png',
  //     contentType: 'image/png',
  //     size: 74473,
  //     appId: '1c10309e-7897-4190-998d-128b4a5b0638',
  //   })

  return apiClient.file.createPresignedUrl.mutate({
    filename: file.data instanceof File ? file.data.name : 'test',
    contentType: file.data.type || '',
    size: file.size,
  })
})

// function onFiles(files: File[]) {
//   uploader.addFiles(files.map(file => ({ data: file })))
//   uploader.upload()
// }

const uploaded = ref('')
// uploader.on('upload-success', (file, resp) => {
//   uploaded.value = resp.uploadURL
// })

function onFilesUploaded(url) {
  uploaded.value = url
}
</script>

<template>
  <div ref="containerRef">
    <!--  <VueUploadButton :on-file-chosen="onFiles">
      aa
    </VueUploadButton>
    -->
    <VueUploadButton :on-file-chosen="onFilesUploaded" :uploader="uploader" />
    <img :src="uploaded" alt="">
  </div>
</template>
