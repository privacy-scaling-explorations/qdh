import { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import useGlobalState from 'hooks/useGlobalState'
import HamburgerMenu from 'components/HamburgerMenu'
import VotingControls from 'components/VotingControls'
import WalletConnectButton from 'components/WalletConnectButton'
import NotEligibleToSignUpPopup from 'components/NotEligibleToSignUpPopup'
import SignUpPopup from 'components/SignUpPopup'
import Loader from 'components/Loader'

export default function Nav() {
  const [{ address, balance, hasEligiblePOAPtokens, signedUp, loading }] = useGlobalState()
  const [_lastBalance, set_lastBalance] = useState(0)

  useEffect(() => {
    if (_lastBalance === balance) return
    setTimeout(() => {
      set_lastBalance(balance)
    }, 1000)
  }, [balance])

  return (
    <nav className='relative z-10'>
      <ul className='flex justify-between p-4'>
        <h1 className='text-2xl'>Quadratic Dollar Homepage</h1>
        <div className='space-x-2'>
          {loading && <Loader className='relative inline-block -mt-1 text-left' />}
          <WalletConnectButton />
          {balance && (
            <a className='px-6 button' title='Your voice credits'>
              <CountUp end={balance} start={_lastBalance} /> credits
            </a>
          )}
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
