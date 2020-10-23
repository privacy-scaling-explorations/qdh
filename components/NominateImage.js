import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import Modal from 'components/Modal'
import Button from './Button'

export function ImageDropZone() {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png',
    multiple: false,
  })

  return (
    <a
      className='flex flex-wrap content-center block h-48 p-5 text-center border-2 rounded cursor-pointer hover:border-gray-400'
      {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? <p className='w-full'>Drop it!</p> : <p className='w-full'>Drag 'n' drop a picture here</p>}
    </a>
  )
}

export default function NominateImage({ ...props }) {
  const [isOpen, setIsOpen] = useState(props.isOpen || false)
  const nominate = () => {}
  return (
    <Modal
      isOpen={isOpen}
      onOpenStateChange={state => setIsOpen(state)}
      className='space-y-2'
      title='Nominate an Image'
      trigger={props.trigger}>
      <ImageDropZone />
      <input
        className='block w-full px-4 py-2 mt-3 border-2 border-gray-300 rounded hover:border-gray-400'
        placeholder='Title'
      />
      <input
        className='block w-full px-4 py-2 mt-3 border-2 border-gray-300 rounded hover:border-gray-400'
        placeholder='Link'
      />
      <Modal.Actions>
        <span className='flex w-full mt-3 sm:mt-0 sm:w-auto'>
          <Button onClick={setIsOpen.bind(false, this)}>Cancel</Button>
        </span>
        <span className='flex self-end w-full mt-3 sm:mt-0 sm:w-auto'>
          <button
            type='button'
            onClick={nominate}
            className='inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-green-600 border border-green-600 rounded-md shadow-sm hover:text-green-200 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue sm:text-sm sm:leading-5'>
            Nominate
          </button>
        </span>
      </Modal.Actions>
    </Modal>
  )
}
