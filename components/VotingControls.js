import useGlobalState from 'hooks/useGlobalState'
import classnames from 'classnames'
import NominateImageModal from 'components/NominateImage'

const Row = ({ children, className, ...props }) => <div className={classnames('space-x-2', className)}>{children}</div>

export default function VotingControls() {
  const [state, actions] = useGlobalState()
  const { selected, voteSquare, bribedMode } = state
  const { imBeingBribed, incVote, decVote, vote } = actions

  return (
    <div className='space-y-6 text-right'>
      {selected !== null ? (
        <>
          <Row className='-mb-2 text-center'>
            <span className='text-center text-cyan min-width-'>Vote for #{selected}:</span>
          </Row>
          <Row>
            <a className='px-6 select-none button' onClick={decVote}>
              -
            </a>
            <span className='inline-block w-16 px-0 py-2 text-center cursor-default button'>{voteSquare}</span>
            <a className='px-6 select-none button' onClick={incVote}>
              +
            </a>
          </Row>
          <Row className='inline-block min-w-full'>
            <a className='inline-block min-w-full px-6 -mt-2 text-center select-none leading-1 button' onClick={vote}>
              Cast your Vote
            </a>
          </Row>
        </>
      ) : (
        <>
          <Row>
            <a onClick={imBeingBribed} className='px-6 text-yellow-400 border-yellow-400 button'>
              {bribedMode ? `⚠️ "I'm being bribed" mode is ON` : `"I'm being bribed" mode`}
            </a>
          </Row>
          <Row>
            <NominateImageModal trigger={<a className='px-6 button'>Nominate an image</a>} />
          </Row>
        </>
      )}
    </div>
  )
}
