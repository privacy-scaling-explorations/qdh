import useGlobalState from 'hooks/useGlobalState'
import classnames from 'classnames'

export function Box({ style, isSelected, onClick, ...props }) {
  return (
    <a
      onClick={onClick}
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
  const { selected, canvas, boxes } = state
  const { selectImage } = actions

  return (
    <div className='relative mx-auto' style={{ width: canvas.w || 600 }}>
      {boxes.map((image, key) => (
        <Box
          key={key}
          isSelected={selected === image.index}
          onClick={_ => {
            if (selected === image.index) {
              selectImage(null) // unselect
            } else {
              selectImage(image.index)
            }
          }}
          style={{
            height: image.h,
            width: image.w,
            top: image.y,
            left: image.x,
            backgroundColor: image.color,
            backgroundImage: `url(${image.url})`,
            backgroundSize: 'cover'
          }}
        />
      ))}
    </div>
  )
}
