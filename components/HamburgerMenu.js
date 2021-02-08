import { useState } from 'react'
import useGlobalState from 'hooks/useGlobalState'
import Link from 'next/link'
import Dropdown from 'components/Dropdown'
import Modal from 'components/Modal'
import Button from 'components/Button'
import {
  HiOutlineKey,
  HiDotsVertical,
  HiOutlineExclamation,
  HiExclamation,
  HiChartPie,
  HiXCircle,
} from 'react-icons/hi'
import { VscJson } from 'react-icons/vsc'
import { tallyUpload } from '../libs/tallyUpload'

const dropDownItemClasses = `block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900`

export default function HamburgerMenu() {
  const [modalOpen, setModalOpen] = useState(false)
  const [state, actions] = useGlobalState()
  const { maciAddress, bribeMode } = state
  const { addChangeKeyToCart, toggleBribeMode, setMaciAddress, setTallyResult, fetchImages, resetSignupState } = actions

  return (
    <Dropdown
      className='w-48 text-center'
      trigger={
        <a className='w-5 px-2 overflow-hidden border-none outline-none button'>
          <HiDotsVertical className='inline w-5 h-5' />
        </a>
      }>
      <a
        className={dropDownItemClasses}
        onClick={_ => {
          addChangeKeyToCart()
          document.dispatchEvent(new Event('mousedown')) // closes the dropdown
        }}
        role='menuitem'>
        <HiOutlineKey className='inline text-orange-500' /> Change key
      </a>
      <a className={dropDownItemClasses} onClick={_ => toggleBribeMode()} role='menuitem'>
        {bribeMode ? (
          <span title={`I'm being bribed mode is ON`}>
            <HiExclamation className='inline text-red-600' /> <b>I'm being bribed</b> mode is on.
          </span>
        ) : (
          <span>
            <HiOutlineExclamation className='inline text-red-600' /> I'm being bribed
          </span>
        )}
      </a>
      <hr />
      <a
        className={dropDownItemClasses}
        onClick={_ => {
          const address = prompt('Enter MACI address:', maciAddress || '0x123…')
          if (address) {
            if (/^0x[a-fA-F0-9]{40}$/gi.test(address)) {
              setMaciAddress(address)
              document.dispatchEvent(new Event('mousedown')) // closes the dropdown
            } else {
              alert('Invalid Ethereum address. Please try again.')
            }
          }
        }}
        role='menuitem'>
        <HiChartPie className='inline text-indigo-600' /> Set MACI Address
      </a>
      <a
        className={dropDownItemClasses}
        onClick={tallyUpload.bind(this, tallyResult => {
          setTallyResult(tallyResult)
          fetchImages()
        })}
        role='menuitem'>
        <VscJson className='inline text-yellow-800' /> Load tally.json
      </a>
      <a className={'hover:text-red-700 ' + dropDownItemClasses} onClick={resetSignupState} role='menuitem'>
        <HiXCircle className='inline' /> Reset State
      </a>
      <hr />
      <Modal
        isOpen={modalOpen}
        onOpenStateChange={state => setModalOpen(state)}
        title='About Quadratic Dollar Homepage'
        trigger={
          <a className={dropDownItemClasses} role='menuitem'>
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
    </Dropdown>
  )
}
