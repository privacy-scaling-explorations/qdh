import pluralize from 'pluralize'
import useGlobalState from 'hooks/useGlobalState'
import HamburgerMenu from 'components/HamburgerMenu'
import VotingControls from 'components/VotingControls'
import WalletConnectButton from 'components/WalletConnectButton'
import NotEligibleToSignUpPopup from 'components/NotEligibleToSignUpPopup'
import NominateImageModal from 'components/NominateImage'
import SignUpPopup from 'components/SignUpPopup'
import InitialKeyChangePopup from 'components/InitialKeyChangePopup'
import Loader from 'components/Loader'
import Countdown from 'react-countdown'

const SignUpCountDown = ({ votingDeadline, signedUp }) => {
  if (!votingDeadline) return null
  if (Math.round(votingDeadline - Date.now() / 1000) < 0) return null
  if (signedUp) {
    return (
      <span className='px-6 border-none cursor-default button' title='Voting deadline'>
        Voting ends in <Countdown daysInHours={true} date={votingDeadline * 1000} />
      </span>
    )
  } else {
    return (
      <span className='px-6 border-none cursor-default button' title='Signup deadline'>
        Signup ends in <Countdown daysInHours={true} date={votingDeadline * 1000} />
      </span>
    )
  }
}

export default function Nav() {
  const [state, actions] = useGlobalState()
  const {
    address,
    balance,
    hasEligiblePOAPtokens,
    signedUp,
    initialKeyChangePerformed,
    loading,
    votingDeadline,
  } = state

  return (
    <nav className='relative z-10'>
      <ul className='flex justify-between p-4'>
        <h1 className='text-2xl'>Quadratic Dollar Homepage</h1>
        <div className='space-x-2'>
          {loading && <Loader className='relative inline-block -mt-1 text-left' />}
          <SignUpCountDown votingDeadline={votingDeadline} signedUp={signedUp} />
          {address && hasEligiblePOAPtokens && signedUp && (
            <>
              <span className='px-6 border-none cursor-default button' title='Your voice credits'>
                {balance} {pluralize('credits', balance)}
              </span>
              <NominateImageModal trigger={<a className='inline px-6 select-none button'>Nominate an image</a>} />
            </>
          )}
          <WalletConnectButton />
          <HamburgerMenu />
        </div>
        <div className='absolute right-0 top-auto pr-4' style={{ top: '4em' }}>
          {(() => {
            if (!address) return null
            if (!hasEligiblePOAPtokens) {
              return <NotEligibleToSignUpPopup />
            } else if (hasEligiblePOAPtokens && !signedUp) {
              return <SignUpPopup />
            } else if (hasEligiblePOAPtokens && signedUp && !initialKeyChangePerformed) {
              return <InitialKeyChangePopup />
            } else if (hasEligiblePOAPtokens && signedUp && initialKeyChangePerformed) {
              return <VotingControls />
            }
          })()}
        </div>
      </ul>
    </nav>
  )
}
