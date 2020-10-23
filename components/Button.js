import classnames from 'classnames'

export default function Button({ content, children, className, ...props }) {
  return (
    <button
      type='button'
      className={classnames(
        'inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue sm:text-sm sm:leading-5',
        className
      )}
      {...props}>
      {content || children || 'Ok. Nice!'}
    </button>
  )
}
