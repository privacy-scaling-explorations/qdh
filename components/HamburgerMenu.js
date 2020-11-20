import { useState } from 'react'
import useVoting from 'hooks/useVoting'
import Link from 'next/link'
import Dropdown from 'components/Dropdown'
import Modal from 'components/Modal'
import Button from 'components/Button'

export default function HamburgerMenu() {
  const [{ keyPair }, { changeKey }] = useVoting()
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <Dropdown
      trigger={
        <a className='w-5 px-2 overflow-hidden border-none outline-none button'>
          <svg
            className='inline w-5'
            style={{ verticalAlign: 'sub' }}
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'>
            <path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z' />
          </svg>
        </a>
      }>
      <Modal
        isOpen={modalOpen}
        onOpenStateChange={state => setModalOpen(state)}
        title='About Quadratic Dollar Homepage'
        trigger={
          <a
            className='block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
            role='menuitem'>
            About
          </a>
        }>
        <p className='text-sm leading-5 text-gray-600'>
          The inspiration for this project is the Million Dollar Homepage. MDH allowed anyone to purchase pixels on an
          image on a website and use said pixels to display anything they wanted.
          <br />
          <br /> The Quadratic Dollar Homepage is a spin on the MDH. While it also features a space for images on a
          webpage, it allows users to vote on how much space each image takes up. Moreover, it employs a quadratic and
          collusion-resistant voting mechanism on Ethereum called Minimal Anti-Collusion Infrastructure (MACI) to
          prevent bribery and scale images quadratically.
        </p>
        <Modal.Actions>
          <span>{/* Dummy span to align "Nice" button to the right */}</span>
          <span className='flex w-full mt-3 sm:mt-0 sm:w-auto'>
            <Button onClick={setModalOpen.bind(false, this)} content='Nice!' />
          </span>
        </Modal.Actions>
      </Modal>
      <Link href='https://github.com/ksaitor/qdh'>
        <a
          target='_blank'
          className='block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
          role='menuitem'>
          Github
        </a>
      </Link>
      <a
        className='block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
        onClick={changeKey}
        role='menuitem'>
        Change key
      </a>
    </Dropdown>
  )
}
