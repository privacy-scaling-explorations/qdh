import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import { Transition } from '@headlessui/react'
import Button from 'components/Button'
import find from 'lodash/find'
import pull from 'lodash/pull'

function Modal({ trigger, title, children, allowEasyClose = true, onOpenStateChange, ...props }) {
  const [isOpen, setIsOpen] = useState(props.isOpen || false)

  useEffect(() => {
    setIsOpen(props.isOpen || false)
  }, [props.isOpen])

  useEffect(() => {
    onOpenStateChange && onOpenStateChange(isOpen)
  }, [isOpen])

  const childrenArr = React.Children.toArray(children)
  const actions = find(childrenArr, child => child.type === Actions) || (
    <Actions>
      <span className='flex w-full mt-3 sm:mt-0 sm:w-auto'>
        <Button onClick={() => setIsOpen(v => !v)} />
      </span>
    </Actions>
  )
  children = pull(childrenArr, actions)

  return (
    <>
      <div onClick={() => setIsOpen(v => !v)}>{typeof trigger === 'undefined' ? <span>Open Modal</span> : trigger}</div>
      <Transition
        show={isOpen}
        enter='transition ease-out duration-300'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition ease-in duration-200 delay-500'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
        className='fixed inset-0 z-20 overflow-y-auto'>
        <div className='flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
          <Transition
            show={isOpen}
            enter='transition ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            className='fixed inset-0 transition-opacity delay-150'>
            <div onClick={_ => setIsOpen(false)} className='absolute inset-0 bg-black opacity-50'></div>
          </Transition>
          {/* This element is to trick the browser into centering the modal contents. */}
          <span className='hidden sm:inline-block sm:align-middle sm:h-screen'></span>&#8203;
          <Transition
            show={isOpen}
            enter='transition ease-out duration-300 delay-700'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='transition duration-200'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            className='inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
            role='dialog'
            aria-modal='true'
            aria-labelledby='modal-headline'>
            <div className='px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4'>
              <div className='sm:flex sm:items-start '>
                {props.icon && (
                  <div className='flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-green-100 rounded-full sm:mx-0 sm:h-10 sm:w-10'>
                    <svg
                      className='w-6 h-6 text-green-600'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  </div>
                )}
                <div className='w-full mt-3 text-center sm:mt-0 sm:text-left'>
                  <h3 className='text-lg font-medium leading-6 text-gray-900' id='modal-headline'>
                    {title || 'Title goes here'}
                  </h3>
                  <div className='mt-2'>
                    {children || <p className='text-sm leading-5 text-gray-500'>Example content text</p>}
                  </div>
                </div>
              </div>
            </div>
            {actions}
          </Transition>
        </div>
      </Transition>
    </>
  )
}

export function Actions({ children, className, ...props }) {
  return (
    <div className={classnames('px-4 py-3 justify-between pb-5 space-x-2 bg-gray-50 sm:px-6 sm:flex', className)}>
      {children}
    </div>
  )
}

Modal.Actions = Actions
export default Modal
