import React, { useCallback, useState } from 'react'
import useGlobalState from 'hooks/useGlobalState'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import Modal from 'components/Modal'
import Button from 'components/Button'

export function ImageDropZone({ formControls, ...props }) {
  const { setValue } = formControls
  const [picture, setPicture] = useState(null)
  const onDrop = useCallback(files => {
    const reader = new FileReader()
    reader.onload = e => {
      setValue('picture', e.target.result, { shouldDirty: true })
      setPicture(e.target.result)
    }
    reader.onerror = err => console.error(err)
    reader.readAsDataURL(files[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png',
    multiple: false,
  })

  return (
    <a
      className='relative flex flex-wrap content-center block h-48 p-5 overflow-hidden text-center border-2 rounded cursor-pointer hover:border-gray-400'
      {...getRootProps()}>
      <input {...getInputProps()} />
      <p className='z-10 w-full' style={{ textShadow: '0px 0px 2px white' }}>
        {isDragActive ? 'Drop it!' : "Drag 'n' drop a picture here"}
      </p>
      {Boolean(picture) && <img className='absolute top-0 left-0 w-full -z-10' src={picture} />}
    </a>
  )
}

export default function NominateImage({ ...props }) {
  const { register, errors, handleSubmit, setValue } = useForm()
  const [{}, { setLoading, fetchImages }] = useGlobalState()
  const [isOpen, setIsOpen] = useState(props.isOpen || false)
  const [uploading, setUploading] = useState(false)

  const nominate = async formData => {
    if (uploading) return
    setLoading(true)
    setUploading(true)
    const res = await fetch('/api/imageUpload', {
      method: 'POST',
      body: JSON.stringify(formData),
    })
    setLoading(false)
    const data = await res.json()
    setUploading(false)
    setIsOpen(false)
    fetchImages()
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenStateChange={state => setIsOpen(state)}
      className='space-y-2'
      title='Nominate an image'
      trigger={props.trigger}>
      <ImageDropZone formControls={{ setValue }} />
      <input type='hidden' name='picture' ref={register({ required: true })} />
      <Modal.Actions>
        <span className='flex w-full mt-3 sm:mt-0 sm:w-auto'>
          <Button onClick={setIsOpen.bind(false, this)}>Close</Button>
        </span>
        <span className='flex self-end w-full mt-3 sm:mt-0 sm:w-auto'>
          <button
            type='button'
            onClick={handleSubmit(nominate)}
            className='inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-green-600 border border-green-600 rounded-md shadow-sm hover:text-green-200 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue sm:text-sm sm:leading-5'>
            {uploading ? 'Uploading...' : 'Nominate'}
          </button>
        </span>
      </Modal.Actions>
    </Modal>
  )
}
