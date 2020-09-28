import Link from 'next/link'
import Dropdown from 'components/Dropdown'
import Modal from 'components/Modal'

export default function HamburgerMenu() {
  return (
    <Dropdown trigger={<a className='select-none button'>…</a>}>
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
