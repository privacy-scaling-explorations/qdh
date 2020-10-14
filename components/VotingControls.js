import useVoting from 'hooks/useVoting'
import classnames from 'classnames'

const Row = ({ children, className, ...props }) => <div className={classnames('space-x-2', className)}>{children}</div>

export default function VotingControls() {
  const [state, actions] = useVoting()
  const { selected, voteRootValue } = state
  const { imBeingBribed, incVote, decVote } = actions

  return (
    <div className='space-y-3 text-right'>
      {selected !== false ? (
        <>
          <Row className='text-center'>
            <span className='text-center text-cyan min-width-'>Vote for #{selected}:</span>
          </Row>
          <Row>
            <a className='px-6 select-none button' onClick={decVote}>
              -
            </a>
            <a className='inline-block w-16 px-0 py-2 text-center button'>{Math.pow(voteRootValue, 2)}</a>
            <a className='px-6 select-none button' onClick={incVote}>
              +
            </a>
          </Row>
          <Row className='inline-block min-w-full'>
            <a className='inline-block min-w-full px-6 text-center leading-1 button'>Cast a Vote</a>
          </Row>
        </>
      ) : (
        <>
          <Row>
            <a onClick={imBeingBribed} className='px-6 text-yellow-400 border-yellow-400 button'>
              "I'm being bribed" mode
            </a>
          </Row>
          <Row>
            <a className='px-6 button'>Nominate Image</a>
          </Row>
        </>
      )}
    </div>
  )
}
