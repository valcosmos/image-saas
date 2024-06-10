<script lang="tsx">
import { createApiClient } from '@image-saas/api'
import { UploadButtonWithUploader } from '@image-saas/upload-button'
import { h, render } from 'preact'
import { connect } from '@image-saas/preact-vue-connect'
import { createUploader } from '@image-saas/uploader'
import { DropzoneWithUploader } from '@image-saas/drop-zone'
// const apiKey = 'a06950db-5cc2-4a53-b8e5-5f53fccf7777'

export default defineComponent({
  setup() {
    const containerRef = ref()
    // watchEffect(() => {
    //   if(containerRef.value)render(h(UploadButton), containerRef.value)
    // })

    const VueUploadButton = connect(UploadButtonWithUploader)
    const VueDropzone = connect(DropzoneWithUploader)

    const uploader = createUploader(async (file) => {
      const tokenResp = await fetch('/api/test')
      const token = await tokenResp.text()

      const apiClient = createApiClient({ signedToken: token })
      return apiClient.file.createPresignedUrl.mutate({
        filename: file.data instanceof File ? file.data.name : 'test',
        contentType: file.data.type || '',
        size: file.size,
      })
    })

    const uploaded = ref('')

    function onFileUploaded(url) {
      uploaded.value = url
    }

    function clearUploaded() {
      uploaded.value = ''
    }

    const dragging = ref(false)

    watchEffect(() => {
      console.log(dragging.value)
    })

    const dropzoneInnerClass = computed(() =>
      dragging.value ? 'dropzone-inner dragging' : 'dropzone-inner',
    )

    function onDraggingChanged(flag) {
      dragging.value = flag
    }

    return () => (
      <div class="container">
        <VueUploadButton
          onFileUploaded={onFileUploaded}
          uploader={uploader}
          class-name="upload-button"
        >
          Click To Chose File
        </VueUploadButton>
        <VueDropzone
          onFileUploaded={onFileUploaded}
          onDraggingChange={onDraggingChanged}
          uploader={uploader}
          class-name="dropzone"
        >
          <div class={dropzoneInnerClass.value}>
            { dragging.value ? 'Drop Here to Upload' : 'Drag File Here' }
          </div>
        </VueDropzone>
        { uploaded.value && (
          <div class="preview">
            <button class="preview-close" onClick={clearUploaded}>
              X
            </button>
            <div class="preview-overlay" />
            <div class="preview-content">
              <img src={uploaded.value} />
            </div>
          </div>
        ) }
      </div>
    )
  },
})
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

.upload-button {
  appearance: none;
  padding: 8px;
  border: 0;
  border-radius: 4px;
  background: #030303;
  color: #efefef;
  cursor: pointer;
}

.upload-button:hover {
  background: #222222;
  color: #efefef;
}

.dropzone {
  border-style: dashed;
  border-width: 2px;
  width: 50vw;
  height: 50vh;
}

.dropzone-inner {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}

.dropzone-inner.dragging {
  background: #e6abab;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 100vh;
  box-sizing: border-box;
}

.preview {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  background: #030303;
  opacity: 0.3;
}

.preview-content {
  width: 70%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-content > img {
  width: 100%;
  z-index: 10;
}

.preview-close {
  appearance: none;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  position: absolute;
  right: 10%;
  top: 10%;
  z-index: 10;
  border-radius: 20px;
  border: 0;
}

.preview-close:hover {
  background: #eaeaea;
}
</style>
