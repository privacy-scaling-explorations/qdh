import Link from 'next/link'
import Dropdown from 'components/Dropdown'
import Modal from 'components/Modal'

export default function HamburgerMenu() {
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
      <Link href='/'>
        <a
          className='block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
          role='menuitem'>
          About
        </a>
      </Link>
      <Link href='https://github.com/ksaitor/qdh'>
        <a
          target='_blank'
          className='block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
          role='menuitem'>
          Github
        </a>
      </Link>
      <Modal
        trigger={
          <a
            className='block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
            role='menuitem'>
            Modal
          </a>
        }
      />
    </Dropdown>
  )
}
