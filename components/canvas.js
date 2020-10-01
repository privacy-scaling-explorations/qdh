import { useState, useEffect } from 'react'
import random from 'lodash/random'
import pack from 'libs/binpack'
import classnames from 'classnames'

const BOXES = Array.from(Array(10)).map(_ => {
  const _size = (2 ^ random(1, 10)) * 20
  return {
    w: _size,
    h: _size,
    color: '#' + (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6),
  }
})

export function Box({ style, isSelected, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={classnames('box absolute z-0 rounded cursor-pointer hover:shadow-outline hover:z-10', {
        'shadow-outline z-10 isSelected': isSelected,
      })}
      style={style}
    />
  )
}

export default function Canvas() {
  const [selected, setSelected] = useState()
  const { canvas, boxes } = pack(BOXES, 'maxrects')

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
