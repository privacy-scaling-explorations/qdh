import useVoting from 'hooks/useVoting'
import HamburgerMenu from 'components/HamburgerMenu'
import VotingControls from 'components/VotingControls'
import WalletConnectButton from 'components/WalletConnectButton'

export default function Nav() {
  const [{ balance }] = useVoting()
  return (
    <nav>
      <ul className='flex justify-between p-4'>
        <h1 className='text-2xl '>Quadratic Dollar Homepage</h1>
        <div className='space-x-2'>
          <WalletConnectButton />
          {balance && (
            <a className='px-6 button' title='Your voice credits'>
              {balance} credits
            </a>
          )}
          <HamburgerMenu />
        </div>
        <div className='absolute right-0 top-auto pr-4' style={{ top: '4em' }}>
          <VotingControls />
        </div>
      </ul>
    </nav>
  )
}
