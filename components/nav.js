import dynamic from 'next/dynamic'
const WalletConnectButton = dynamic(() => import('components/WalletConnectButton'), { ssr: false })

import Link from 'next/link'

export default function Nav() {
  return (
    <nav>
      <ul className='flex items-center justify-between p-4'>
        <h1 className='text-2xl'>Quadratic Dollar Homepage</h1>
        <WalletConnectButton />
      </ul>
    </nav>
  )
}
