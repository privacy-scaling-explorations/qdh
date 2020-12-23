import { useState, useEffect } from 'react'
import useGlobalState from 'hooks/useGlobalState'
import Modal from 'components/Modal'
import Button from 'components/Button'

export default function NotEligibleToSignUpPopup() {
  const [{ address, hasEligiblePOAPtokens }, actions] = useGlobalState()
  const [modalOpen, setModalOpen] = useState(hasEligiblePOAPtokens === false)

  useEffect(() => {
    if (hasEligiblePOAPtokens === false) {
      setModalOpen(true)
    }
  }, [hasEligiblePOAPtokens])

  if (hasEligiblePOAPtokens === false) {
    return (
      <Modal
        isOpen={modalOpen}
        onOpenStateChange={state => setModalOpen(state)}
        title={`You don't have eligible tokens to sign up`}
        trigger={
          <span className='px-6 text-yellow-400 border-yellow-400 button'>⚠️ Your account is not eligible to vote</span>
        }>
        <div className='mt-5 text-sm text-gray-900'>
          <p>To be eligible to vote or nominate candidates, you need to have at least one of these tokens:</p>
          <ul className='my-2 list-disc list-inside'>
            <li>POAP (from any 2018-2020 event)</li>
            <li>BRICK</li>
            <li>MOON</li>
          </ul>
          <p>Make sure your wallet has one of these and try again.</p>
        </div>
        <Modal.Actions>
          <span>{/* Dummy span to align "Nice" button to the right */}</span>
          <span className='flex w-full mt-3 sm:mt-0 sm:w-auto'>
            <Button onClick={setModalOpen.bind(false, this)} content='Okay' />
          </span>
        </Modal.Actions>
      </Modal>
    )
  } else {
    return null
  }
}
