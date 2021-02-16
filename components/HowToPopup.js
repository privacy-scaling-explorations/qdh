import { HiOutlineKey, HiDotsVertical, HiExclamation } from 'react-icons/hi'
import { useState, useEffect } from 'react'
import Modal from 'components/Modal'
import Button from 'components/Button'

export default function HowtoPopup({ trigger }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [howtoPopUpWasShown, setHowtoPopUpWasShown] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const _howtoPopUpWasShown = Boolean(localStorage.getItem('howtoPopUpWasShown'))
      if (!_howtoPopUpWasShown) {
        setModalOpen(true)
      }
      setHowtoPopUpWasShown(_howtoPopUpWasShown)
    }
  }, [])

  const onOpenStateChange = state => {
    if (state === false && howtoPopUpWasShown === false) {
      localStorage.setItem('howtoPopUpWasShown', true)
    }
    setModalOpen(state)
  }

  return (
    <Modal
      isOpen={modalOpen}
      easyToDismiss={false}
      onOpenStateChange={onOpenStateChange}
      trigger={trigger}
      title='How to vote'>
      <ol className='pl-4 mb-5 text-sm leading-5 text-gray-800 list-decimal list-outside'>
        <li>
          <b>Sign up</b> before the deadline.
        </li>
        <li>
          You’ll be asked to perform the initial key change right away. You can also perform a{' '}
          <HiOutlineKey className='inline text-orange-500' /> key-change any time you want, from the{' '}
          <HiDotsVertical className='inline w-4 h-4 -mr-1' /> <b>Menu</b>. Changing your voting key allows you to
          plausibly deny to a briber that you’ve have cast a valid vote.
        </li>
        <li>
          Once you’ve signed up, you can pick any image (or upload one yourself) select how many votes you’d like to
          cast for it, and add it to your “voting cart”.
        </li>
        <li>
          Once you feel happy with the votes you’ve selected, go ahead click "<b>Vote</b>" to cast all votes at once.
        </li>
      </ol>
      {/* <br />
    The inspiration for this project is the Million Dollar Homepage. MDH allowed anyone to purchase pixels on an
    image on a website and use said pixels to display anything they wanted.
    <br />
    <br /> The Quadratic Dollar Homepage is a spin on the MDH. While it also features a space for images on a
    webpage, it allows users to vote on how much space each image takes up. Moreover, it employs a quadratic and
    collusion-resistant voting mechanism on Ethereum called{' '}
    <a href='https://github.com/appliedzkp/maci' target='_blank'>
      Minimal Anti-Collusion Infrastructure (MACI)
    </a>{' '}
    to prevent bribery and scale images quadratically. */}

      <h3 className='mb-2 text-lg font-medium leading-6 text-gray-900'>If you are being bribed</h3>
      <p className='mb-5 text-sm leading-5 text-gray-800'>
        You can turn on <HiExclamation className='inline text-red-600' /> <b>I'm being bribed</b> mode from the{' '}
        <HiDotsVertical className='inline w-4 h-4 -mr-1' /> <b>Menu</b>. This allows you to cast invalid votes, that a
        briber wont distinguish from the valid votes. You can also enable this mode with{' '}
        <b className='p-1 py-0 ml-1 border border-gray-600 rounded'>b</b> keyboard shortcut and go back to the normal
        voting mode with <b className='p-1 py-0 ml-1 border border-gray-600 rounded'>n</b> shortcut.
      </p>
      <h3 className='mb-2 text-lg font-medium leading-6 text-gray-900'>Learn more</h3>
      <p className='mb-5 text-sm leading-5 text-gray-800'>
        To learn more about how QDH and MACI works <a>click here</a>
      </p>
      <hr className='mb-4 border-gray-400' />
      <p className='mb-5 text-sm leading-5 text-center text-gray-700'>
        You can always access this guide from <HiDotsVertical className='inline w-4 h-4 -mr-1' /> <b>Menu</b> >{' '}
        <b>How to vote?</b>
      </p>
      <Modal.Actions>
        <span>{/* Dummy span to align "Nice" button to the right */}</span>
        <span className='flex w-full mt-3 sm:mt-0 sm:w-auto'>
          <Button onClick={setModalOpen.bind(false, this)} content='Nice!' />
        </span>
      </Modal.Actions>
    </Modal>
  )
}
