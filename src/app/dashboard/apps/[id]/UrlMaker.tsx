import { useState } from 'react'
import copy from 'copy-to-clipboard'
import { toast } from 'sonner'
import { Slider } from '@/components/ui/Slider'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function UrlMaker({ id }: { id: string }) {
  const [width, setWidth] = useState<number>(250)
  const [rotate, setRotate] = useState<number>(0)
  const [url, setUrl] = useState(`/image/${id}?width=${width}&rotate=${rotate}`)

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>Rotate: </span>
          <Slider
            max={180}
            min={-180}
            step={5}
            className="relative flex h-5 w-[200px] touch-none select-none items-center"
            onValueChange={v => setRotate(v[0] ?? 0)}
            value={[rotate]}
          />
        </div>
        <div>
          <label htmlFor="widthInput" className="mr-2">
            width:
          </label>
          <Input
            id="widthInput"
            type="number"
            value={width}
            max={2000}
            min={100}
            className="input input-bordered input-sm"
            onChange={e => setWidth(Number(e.target.value))}
          />
        </div>
        <Button onClick={() => setUrl(`/image/${id}?width=${width}&rotate=${rotate}`)}>Make</Button>
      </div>

      <div>
        <div className="flex justify-center items-center">
          <img src={url} alt="generate url" className="max-w-full max-h-[60vh]" />
        </div>
      </div>

      <div className="flex justify-between items-center gap-2">
        <Input value={`${process.env.NEXT_PUBLIC_SITE_URL}${url}`} readOnly />
        <Button onClick={() => {
          copy(`${process.env.NEXT_PUBLIC_SITE_URL}${url}`)
          toast('Copied')
        }}
        >
          Copy
        </Button>
      </div>
    </div>
  )
}
