import { createApiClient } from '@image-saas/api'
import jwt from 'jsonwebtoken'

const apiKey = '2cb8109b-3080-4db4-a269-8f22b049fb49'
const clientId = '506ba7ae-e96b-48c3-9fb3-ebf7c89ad1e7'

export default defineEventHandler(async () => {
  // const apiClient = createApiClient({ apiKey })

  const token = jwt.sign({
    filename: 'demo.png',
    contentType: 'image/png',
    size: 74473,
    appId: '1c10309e-7897-4190-998d-128b4a5b0638',
    clientId,
  }, apiKey, { expiresIn: '10m' })

  return token
  // const response = await apiClient.file.createPresignedUrl.mutate({
  //   filename: 'demo.png',
  //   contentType: 'image/png',
  //   size: 74473,
  //   appId: '1c10309e-7897-4190-998d-128b4a5b0638',
  // })
  // return response
})
