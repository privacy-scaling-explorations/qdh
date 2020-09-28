import Link from 'next/link'
import dynamic from 'next/dynamic'
import HamburgerMenu from 'components/HamburgerMenu'
const WalletConnectButton = dynamic(() => import('components/WalletConnectButton'), { ssr: false })

export default function Nav() {
  return (
    <nav>
      <ul className='flex items-center justify-between p-4'>
        <h1 className='text-2xl'>Quadratic Dollar Homepage</h1>
        <div className='space-x-2'>
          <WalletConnectButton />
          <HamburgerMenu />
        </div>
      </ul>
    </nav>
  )
}
