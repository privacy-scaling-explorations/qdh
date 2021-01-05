import classnames from 'classnames'
import pluralize from 'pluralize'
import useGlobalState from 'hooks/useGlobalState'
import { formatAccountAddress } from 'components/WalletConnectButton'

const TrashIcon = ({ className, ...props }) => (
  <svg
    className={classnames('inline w-6 h-6 cursor-pointer right-0 absolute', className)}
    title='Remove'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    {...props}
    xmlns='http://www.w3.org/2000/svg'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
    />
  </svg>
)

export default function Cart() {
  const [state, actions] = useGlobalState()
  const { cart, boxes } = state
  const { vote, removeFromCart } = actions

  return (
    <div className='w-56 space-y-6 text-right'>
      <h3 className='text-xl text-center'>
        {cart.length} pending {pluralize('vote', cart.length)}
        {Boolean(cart.length) ? ':' : null}
      </h3>
      {cart.map((item, i) => {
        if (item.type === 'keychange') {
          return (
            <div
              className='relative text-left text-white cursor-default'
              key={i}
              title={item.keyPair.pubKey.serialize()}>
              <svg
                className='inline w-6 h-6 ml-1 mr-3'
                fill='none'
                stroke='yellow'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z'></path>
              </svg>
              KeyChange <TrashIcon onClick={_ => removeFromCart(i)} />
            </div>
          )
        } else {
          return (
            <div className='relative text-left text-white cursor-default' key={i}>
              <div
                className='inline-block w-8 h-8 mr-3 align-middle rounded'
                style={{ backgroundColor: boxes[item.imageId].color }}
              />
              {item.voteSquare} {pluralize('credit', item.voteSquare)} for #{item.imageId}{' '}
              <TrashIcon onClick={_ => removeFromCart(i)} />
            </div>
          )
        }
      })}

      {Boolean(cart.length) && (
        <a className='block w-full px-6 text-center button' onClick={vote}>
          Vote
        </a>
      )}
    </div>
  )
}
