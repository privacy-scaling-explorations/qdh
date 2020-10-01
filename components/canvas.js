import { useState, useEffect } from 'react'
import random from 'lodash/random'
import potpack from 'potpack'

let boxes = Array.from(Array(10)).map(_ => {
  const _size = (2 ^ random(1, 10)) * 20
  return { w: _size, h: _size }
})

export function ImageCandidate({ style, isSelected, onClick, ...props }) {
  return <div onClick={onClick} className='absolute z-0 cursor-pointer hover:shadow-outline hover:z-10' style={style} />
}

export default function Canvas() {
  const canvas = potpack(boxes)
  const [selected, setSelected] = useState()

  return (
    <div className='relative mx-auto' style={{ width: canvas.w }}>
      {boxes.map((i, key) => (
        <ImageCandidate
          key={key}
          isSelected={selected === key}
          onClick={_ => {
            setSelected(key)
          }}
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
