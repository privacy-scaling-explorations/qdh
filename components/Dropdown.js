import { useState, useEffect, useRef } from 'react'
import { Transition } from '@tailwindui/react'

export default function Dropdown({ trigger, children }) {
  const ref = useRef()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleClickOutside = e => {
    if (ref.current.contains(e.target)) return
    setIsOpen(false) // outside click
  }

  if (!trigger) {
    trigger = (
      <span className='rounded-md shadow-sm'>
        <button
          type='button'
          className='inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800'
          id='options-menu'
          aria-haspopup='true'
          aria-expanded={isOpen}>
          Options
          <svg className='w-5 h-5 ml-2 -mr-1' viewBox='0 0 20 20' fill='currentColor'>
            <path
              fillRule='evenodd'
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </span>
    )
  }

  return (
    <div ref={ref} className='relative inline-block text-left'>
      <div onClick={() => setIsOpen(v => !v)}>{trigger}</div>
      <Transition
        show={isOpen}
        enter='transition ease-out duration-75'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-150'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
        className='absolute right-0 w-56 mt-4 origin-top-right rounded-md shadow-lg'>
        <div className='bg-white rounded-md shadow-xs'>
          <div className='py-1' role='menu' aria-orientation='vertical' aria-labelledby='options-menu'>
            {children}
          </div>
        </div>
      </Transition>
    </div>
  )
}
