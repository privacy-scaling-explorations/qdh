import useGlobalState from 'hooks/useGlobalState'
import HamburgerMenu from 'components/HamburgerMenu'
import VotingControls from 'components/VotingControls'
import WalletConnectButton from 'components/WalletConnectButton'
import NotEligibleToSignUpPopup from 'components/NotEligibleToSignUpPopup'

export default function Nav() {
  const [{ balance, hasEligiblePOAPtokens }] = useGlobalState()

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
          {hasEligiblePOAPtokens ? <VotingControls /> : <NotEligibleToSignUpPopup />}
        </div>
      </ul>
    </nav>
  )
}
