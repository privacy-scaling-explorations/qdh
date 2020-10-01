import { useState, useCallback, useEffect } from 'react'
import random from 'lodash/random'
import pack from 'libs/binpack'

const BOXES = Array.from(Array(10)).map(_ => {
  const _size = (2 ^ random(1, 10)) * 20
  return {
    w: _size,
    h: _size,
    color: '#' + (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6),
  }
})

export default function useVotes(options = {}) {
  const [box, setWeb3] = useState(false)
  const [selected, setSelected] = useState()
  const { canvas, boxes } = pack(BOXES, 'maxrects')

  return {
    canvas,
    boxes,
    selected,
    setSelected,
    vote: id => {},
  }
}
