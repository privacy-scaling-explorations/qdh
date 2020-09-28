import potpack from 'potpack'
import random from 'lodash/random'

let boxes = Array.from(Array(10)).map(_ => {
  const _size = (2 ^ random(1, 10)) * 10
  return { w: _size, h: _size }
})

export default function Canvas() {
  const canvas = potpack(boxes)
  return (
    <div className='relative mx-auto' style={{ width: canvas.w }}>
      {boxes.map((i, key) => (
        <div
          key={key}
          className='absolute'
          style={{
            height: i.h,
            width: i.w,
            top: i.y,
            left: i.x,
            backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
          }}
        />
      ))}
    </div>
  )
}
