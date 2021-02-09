import { useState, useEffect } from 'react'
import useGlobalState from 'hooks/useGlobalState'
import Modal from 'components/Modal'

export default function InitialKeyChangePopup() {
  const [{ initialKeyChangePerformed, loading }, { changeKey }] = useGlobalState()
  const [modalOpen, setModalOpen] = useState(initialKeyChangePerformed === false)

  useEffect(() => {
    if (initialKeyChangePerformed === false) {
      setModalOpen(true)
    }
  }, [initialKeyChangePerformed])

  if (initialKeyChangePerformed === false) {
    return (
      <Modal
        isOpen={modalOpen}
        easyToDismiss={false}
        onOpenStateChange={state => setModalOpen(state)}
        title={`Perform initial Key-Change`}
        trigger={<span className='px-6 text-yellow-400 border-yellow-400 button'>Let's sign you up!</span>}>
        <p className='mt-5 text-sm leading-5 text-gray-900'>
          You'll be able to plausibly deny to a briber that you've cast a valid vote.
        </p>
        <Modal.Actions>
          <span className='flex w-full mt-3 sm:mt-0 sm:w-auto' />
          <span className='flex self-end w-full mt-3 sm:mt-0 sm:w-auto'>
            <button
              type='button'
              onClick={changeKey}
              className='inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-green-600 border border-green-600 rounded-md shadow-sm hover:text-green-200 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue sm:text-sm sm:leading-5'>
              {loading ? 'Loading…' : 'Change key'}
            </button>
          </span>
        </Modal.Actions>
      </Modal>
    )
  } else {
    return null
  }
}
