import useVoting from 'hooks/useVoting'
import classnames from 'classnames'

export function Box({ style, isSelected, onClick, ...props }) {
  return (
    <a
      onClick={onClick}
      className={classnames('box absolute z-0 rounded cursor-pointer hover:shadow-outline hover:z-10', {
        'shadow-outline z-10 isSelected': isSelected,
      })}
      style={style}
    />
  )
}

export default function Canvas() {
  const { selected, setSelected, canvas, boxes } = useVoting()

  return (
    <div className='relative mx-auto' style={{ width: canvas.w }}>
      {boxes.map((i, key) => (
        <Box
          key={key}
          isSelected={selected === key}
          onClick={_ => {
            if (selected === key) {
              setSelected(null)
            } else {
              setSelected(key)
            }
          }}
          style={{
            height: i.h,
            width: i.w,
            top: i.y,
            left: i.x,
            backgroundColor: i.color,
          }}
        />
      ))}
    </div>
  )
}
