import React, { useState, useCallback, useEffect } from 'react'
import globalHook from 'use-global-hook'
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
const { canvas, boxes } = pack(BOXES, 'maxrects')

const initialState = {
  canvas,
  boxes,
  selected: false,
  voteCredits: 110,
  voteRootValue: 1,
  voteSquare: 1,
  bribedMode: false,
}

const actions = {
  setSelected: (store, value) => {
    store.setState({ selected: value })
  },
  incVote: (store, value) => {
    store.setState({ voteRootValue: store.state.voteRootValue + 1 })
  },
  decVote: (store, value) => {
    if (store.state.voteRootValue <= 1) return
    store.setState({ voteRootValue: store.state.voteRootValue - 1 })
  },
  vote: (store, value) => {},
  imBeingBribed: (store, value) => {
    store.setState({ bribedMode: !store.state.bribedMode })
  },
}

export default globalHook(React, initialState, actions)
