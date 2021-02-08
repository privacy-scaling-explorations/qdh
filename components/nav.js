import pluralize from 'pluralize'
import useGlobalState from 'hooks/useGlobalState'
import HamburgerMenu from 'components/HamburgerMenu'
import VotingControls from 'components/VotingControls'
import WalletConnectButton from 'components/WalletConnectButton'
import NotEligibleToSignUpPopup from 'components/NotEligibleToSignUpPopup'
import NominateImageModal from 'components/NominateImage'
import SignUpPopup from 'components/SignUpPopup'
import Loader from 'components/Loader'
import { useEffect, useState } from 'react'

export default function Nav() {
  const [{ address, balance, hasEligiblePOAPtokens, signedUp, loading, cart, votingDeadline }] = useGlobalState()
  const [countDown, setCountDown] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (votingDeadline) setCountDown(Math.round(votingDeadline - Date.now() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [votingDeadline])

  return (
    <nav className='relative z-10'>
      <ul className='flex justify-between p-4'>
        <h1 className='text-2xl'>Quadratic Dollar Homepage</h1>
        <div className='space-x-2'>
          {loading && <Loader className='relative inline-block -mt-1 text-left' />}
          {Boolean(votingDeadline) && Boolean(countDown > 0) && (
            <span className='px-6 button' title='Signup deadline'>
              Signup deadline in {countDown}s
            </span>
          )}
          <WalletConnectButton />
          {address && hasEligiblePOAPtokens && signedUp && (
            <>
              <a className='px-6 button' title='Your voice credits'>
                {balance} {pluralize('credits', balance)}
              </a>
              <NominateImageModal trigger={<a className='inline px-6 select-none button'>Nominate an image</a>} />
            </>
          )}
          {/* <a className='px-6 button' title='Your voice credits'>
            {cart.length} pending votes
            {Boolean(cart.length) && (
              <span className='absolute inline-block w-2 h-2 rounded-full' style={{ top: -4, background: 'red' }} />
            )}
          </a> */}
          <HamburgerMenu />
        </div>
        <div className='absolute right-0 top-auto pr-4' style={{ top: '4em' }}>
          {(() => {
            if (!address) return null
            if (!hasEligiblePOAPtokens) {
              return <NotEligibleToSignUpPopup />
            } else if (hasEligiblePOAPtokens && !signedUp) {
              return <SignUpPopup />
            } else if (hasEligiblePOAPtokens && signedUp) {
              return <VotingControls />
            }
          })()}
        </div>
      </ul>
    </nav>
  )
}
