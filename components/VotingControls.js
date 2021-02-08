import useGlobalState from 'hooks/useGlobalState'
import classnames from 'classnames'
import NominateImageModal from 'components/NominateImage'
import Cart from 'components/Cart'

const Row = ({ children, className, ...props }) => <div className={classnames('space-x-2', className)}>{children}</div>

export default function VotingControls() {
  const [state, actions] = useGlobalState()
  const { selected, voteSquare, bribedMode, cart } = state
  const { incVote, decVote, addToCart } = actions

  return (
    <div className='relative block space-y-6 text-center'>
      {selected !== null ? (
        <>
          <Row className='-mb-2 text-center'>
            <span className='text-center text-cyan min-width-'>Vote for #{selected}:</span>
          </Row>
          <Row>
            <a className='px-6 select-none button' onClick={decVote}>
              -
            </a>
            <span className='inline-block w-16 px-0 py-2 text-center border-none cursor-default button'>
              {voteSquare}
            </span>
            <a className='px-6 select-none button' onClick={incVote}>
              +
            </a>
          </Row>
          <Row className='inline-block min-w-full'>
            <a
              className='inline-block min-w-full px-6 -mt-2 text-center select-none leading-1 button'
              onClick={addToCart}>
              Add to cart
            </a>
          </Row>
        </>
      ) : (
        <>
          <Row>
            <Cart />
          </Row>
        </>
      )}
    </div>
  )
}
