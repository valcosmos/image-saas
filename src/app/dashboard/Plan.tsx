'use client'

import { trpcClientReact } from '@/utils/api'

export default function Plan() {
  const { data: plan } = trpcClientReact.user.getPlan.useQuery(void 0, {
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return (
    <span className="absolute right--1 top-0 bg-gray-100 rounded-md text-xs inline-block px-2">
      {plan?.plan ?? '...'}
    </span>
  )
}
