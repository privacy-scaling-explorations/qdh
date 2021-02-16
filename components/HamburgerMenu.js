import useGlobalState from 'hooks/useGlobalState'
import Link from 'next/link'
import Dropdown from 'components/Dropdown'
import HowToPopup from 'components/HowToPopup'
import {
  HiOutlineKey,
  HiDotsVertical,
  HiOutlineExclamation,
  HiExclamation,
  HiChartPie,
  HiXCircle,
} from 'react-icons/hi'
import { VscJson } from 'react-icons/vsc'
import { tallyUpload } from 'libs/tallyUpload'

const dropDownItemClasses = `block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900`

export default function HamburgerMenu() {
  const [state, actions] = useGlobalState()
  const { maciAddress, bribeMode } = state
  const { addChangeKeyToCart, toggleBribeMode, setMaciAddress, setTallyResult, fetchImages, resetSignupState } = actions

  return (
    <Dropdown
      className='w-48 text-center'
      trigger={
        <a className='w-5 px-2 overflow-hidden border-none outline-none button' title='Menu'>
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
      <HowToPopup
        trigger={
          <a className={dropDownItemClasses} role='menuitem'>
            How to vote?
          </a>
        }
      />
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
