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

  if (address) {
    return (
      <Modal
        isOpen={modalOpen}
        onOpenStateChange={state => setModalOpen(state)}
        title={`You don't have eligible tokens to sign up`}
        trigger={false}>
        <p className='mt-5 text-sm leading-5 text-gray-900'>
          To be eligible to vote or nominate candidates, you need to have at least one of these tokens:
          <ul className='my-2 list-disc list-inside'>
            <li>POAP (from any 2018-2020 event)</li>
            <li>BRICK</li>
            <li>MOON</li>
          </ul>
          Make sure your wallet has one of these and try again.
        </p>
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
