/**
 * v0 by Vercel.
 * @see https://v0.dev/t/W7PSUmIDvLn
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import type { CSSProperties, SVGAttributes, SVGProps } from 'react'
import { Button } from '@/components/ui/Button'
import { trpcClientReact } from '@/utils/api'

export default function Plan() {
  const { mutate, isPending } = trpcClientReact.user.upgrade.useMutation({
    onSuccess: (resp) => {
      window.location.href = resp.url
    },
  })

  return (
    <div className="w-full max-w-6xl mx-auto py-12 md:py-24">
      <div className="grid gap-8 md:grid-cols-1">
        <div className="bg-card rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary text-primary-foreground p-6 text-center">
            <h3 className="text-2xl font-bold">Pro</h3>
            <p className="text-primary-foreground">For growing teams</p>
          </div>
          <div className="p-6 border-t border-muted">
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-bold">$10</span>
              <span className="text-muted-foreground">per month</span>
            </div>
            <ul className="space-y-2 mt-6 text-muted-foreground">
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                Unlimited Uploads
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                Unlimited Apps
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                Unlimited Storage Configurations
              </li>
              {/* <li className="flex items-center">
                <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                Custom branding
              </li> */}
            </ul>
          </div>
          <div className="p-6 border-t border-muted">
            <Button
              className="w-full"
              disabled={isPending}
              onClick={() => {
                mutate()
              }}
            >
              Upgrade
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckIcon(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
