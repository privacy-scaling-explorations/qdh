import potpack from 'potpack'
import random from 'lodash/random'

const boxes = [
  { w: 300, h: 50 },
  { w: 140, h: 100 },
  { w: 40, h: 10 },
  { w: 410, h: 100 },
  { w: 16, h: 9 },
  { w: 80, h: 40 },
  { w: 400, h: 200 },
]

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
