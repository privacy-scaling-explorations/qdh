import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import Modal from 'components/Modal'

export function ImageDropZone() {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png',
    multiple: false,
  })

  console.log(getInputProps())

  return (
    <a
      className='flex flex-wrap content-center block h-48 p-5 text-center border-2 rounded cursor-pointer hover:border-gray-400'
      {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className='w-full'>Drop the files here ...</p>
      ) : (
        <p className='w-full'>Drag 'n' drop some files here, or click to select files</p>
      )}
    </a>
  )
}

export default function NominateImage({ ...props }) {
  return (
    <Modal className='space-y-2' title='Nominate an Image' trigger={props.trigger}>
      <ImageDropZone />
      <input
        className='block w-full px-4 py-2 mt-3 border-2 border-gray-300 rounded hover:border-gray-400'
        placeholder='Title'
      />
      <input
        className='block w-full px-4 py-2 mt-3 border-2 border-gray-300 rounded hover:border-gray-400'
        placeholder='Link'
      />
    </Modal>
  )
}
