import classnames from 'classnames'
import pluralize from 'pluralize'
import useGlobalState from 'hooks/useGlobalState'
import { HiOutlineKey, HiOutlineTrash } from 'react-icons/hi'

const TrashIcon = ({ className, ...props }) => (
  <HiOutlineTrash
    className={classnames('inline w-6 h-6 cursor-pointer right-0 absolute', className)}
    title='Remove'
    {...props}
  />
)

export default function Cart() {
  const [state, actions] = useGlobalState()
  const { cart, boxes } = state
  const { vote, removeFromCart } = actions

  return (
    <div className='w-56 space-y-6 text-right'>
      <h3 className='text-xl text-center'>
        {Boolean(cart.length) && (
          <>
            {cart.length} pending {pluralize('vote', cart.length)}:
          </>
        )}
      </h3>
      {cart.map((item, i) => {
        if (item.type === 'keychange') {
          return (
            <div
              className='relative text-left text-white cursor-default'
              key={i}
              title={item.keyPair.pubKey.serialize()}>
              <HiOutlineKey className='inline w-6 h-6 ml-1 mr-3' stroke='yellow' /> Change key
              <TrashIcon onClick={_ => removeFromCart(i)} />
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
