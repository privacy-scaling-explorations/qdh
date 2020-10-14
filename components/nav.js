import dynamic from 'next/dynamic'
import HamburgerMenu from 'components/HamburgerMenu'
import VotingControls from 'components/VotingControls'
const WalletConnectButton = dynamic(() => import('components/WalletConnectButton'), { ssr: false })

export default function Nav() {
  return (
    <nav>
      <ul className='flex justify-between p-4'>
        <h1 className='text-2xl '>Quadratic Dollar Homepage</h1>
        <div className='space-x-2'>
          <WalletConnectButton />
          <HamburgerMenu />
        </div>
        <div className='absolute right-0 top-auto pr-4' style={{ top: '4em' }}>
          <VotingControls />
        </div>
      </ul>
    </nav>
  )
}
