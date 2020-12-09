import React, { useState, useCallback, useEffect } from 'react'
import globalHook from 'use-global-hook'
import random from 'lodash/random'
import pack from 'libs/binpack'
import { Keypair, PrivKey } from 'maci-domainobjs'

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
  balance: false,
  selected: false,
  voteCredits: 110,
  voteRootValue: 1,
  voteSquare: 1,
  bribedMode: false,
  keyPair: (() => {
    if (typeof window !== 'undefined') {
      const macisk = localStorage.getItem('macisk')
      if (macisk == null) {
        const keyPair = new Keypair()
        localStorage.setItem('macisk', keyPair.privKey.serialize())
        console.log('MACI key generated', keyPair.pubKey.serialize())
        return keyPair
      } else {
        const keyPair = new Keypair(PrivKey.unserialize(macisk))
        console.log('MACI key loaded', keyPair.pubKey.serialize())
        return keyPair
      }
    }
  })(),
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
  vote: (store, value) => {
    alert('TODO: Voting request…')
    if (store.bribedMode) {
      /*
        There are several ways to cast an invalid vote:

        Use an invalid signature
        Use more voice credits than available
        Use an incorrect nonce
        Use an invalid state index
        Vote for a vote option that does not exist
      */
    }
  },
  imBeingBribed: (store, value) => {
    store.setState({ bribedMode: !store.state.bribedMode })
  },
  changeKey: (store, value) => {
    const keyPair = new Keypair()
    localStorage.setItem('macisk', keyPair.privKey.serialize())
    // TODO send a signature to the contract
    store.setState({ keyPair: keyPair })
    alert(`Voting key changed to:\n${keyPair.pubKey.serialize()}`)
    console.log('MACI key changed', keyPair.pubKey.serialize())
  },
}

export default globalHook(React, initialState, actions)
