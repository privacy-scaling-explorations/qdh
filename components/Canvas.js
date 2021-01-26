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
      {boxes.map((i, key) => (
        <Box
          key={key}
          isSelected={selected === i.index}
          onClick={_ => {
            if (selected === i.index) {
              selectImage(null) // unselect
            } else {
              selectImage(i.index)
            }
          }}
          style={{
            height: i.h,
            width: i.w,
            top: i.y,
            left: i.x,
            backgroundColor: i.color,
            backgroundImage: `url(${i.url})`,
            backgroundSize: 'cover'
          }}
        />
      ))}
    </div>
  )
}
