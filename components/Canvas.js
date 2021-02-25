import useGlobalState from 'hooks/useGlobalState'
import classnames from 'classnames'
import pack from 'libs/binpack'
import find from 'lodash/find'

const BASE_IMAGE_SIZE = 5

export function Box({ style, isSelected, onClick, squareVote, index, ...props }) {
  return (
    <a
      onClick={onClick}
      title={`Image #${index}  Votes: ${squareVote}`}
      className={classnames('box absolute z-0 rounded cursor-pointer hover:shadow-outline hover:z-10', {
        'shadow-outline z-auto isSelected': isSelected,
      })}
      style={style}
      {...props}
    />
  )
}

export default function Canvas() {
  const [state, actions] = useGlobalState()
  const { selected, images: _images, tallyResult } = state
  const { selectImage } = actions
  if (_images.length === 0) return null

  const images = (_images || []).map(image => {
    let multiplier = 1
    if (tallyResult) {
      const totalVoiceCreditsSpent = parseInt(tallyResult.totalVoiceCredits.spent)
      const squareVote = parseInt(tallyResult.totalVoiceCreditsPerVoteOption.tally[image.index])
      multiplier = (squareVote / totalVoiceCreditsSpent) * 100
      image.squareVote = squareVote
    }
    image.w = 50 + BASE_IMAGE_SIZE * multiplier
    image.h = 50 + BASE_IMAGE_SIZE * multiplier
    if (selected === image.index) {
      image.w = 400
      image.h = 400
    }
    image.color = '#' + (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6)
    return image
  })

  const { canvas, boxes } = pack(images, 'maxrects')

  return (
    <div
      className='relative block max-w-full mx-auto'
      style={{ minHeight: '90vh' }}
      onClick={_ => {
        selectImage(null)
      }}>
      <div className='relative block mx-auto' style={{ width: canvas.w || 600 }}>
        {_images.map((image, key) => {
          const { x, y } = find(boxes, ['index', image.index])
          return (
            <Box
              key={image.index}
              index={image.index}
              isSelected={selected === image.index}
              onClick={e => {
                e.stopPropagation()
                if (selected === image.index) {
                  selectImage(null) // unselect
                } else {
                  selectImage(image.index)
                }
              }}
              squareVote={image.squareVote}
              style={{
                height: image.h,
                width: image.w,
                top: y,
                left: x,
                backgroundColor: image.color,
                backgroundImage: `url(${image.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
