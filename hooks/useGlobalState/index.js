import React from 'react'
import globalHook from 'use-global-hook'
import web3state from './web3state'

import random from 'lodash/random'
import pack from 'libs/binpack'
import { signUp as MaciSignUp, changeKey as MaciChangeKey, publish as MaciPublish } from 'libs/MACI'
import { Keypair, PrivKey } from 'maci-domainobjs'

const initialState = {
  ...web3state.initialState,
  loading: true,
  canvas: {},
  boxes: [],
  cart: [],
  balance: (() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('voiceCredits')) || 120
    }
  })(),
  selected: null,
  voteRootValue: 1,
  voteSquare: 1,
  bribedMode: false,
  signedUp: (() => {
    if (typeof window !== 'undefined') {
      return Boolean(localStorage.getItem('userStateIndex')) || false
    }
  })(),
  userStateIndex: (() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('userStateIndex')) || null
    }
  })(),
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
  ...web3state.actions,
  signUp: async (store, value) => {
    store.setState({ loading: true })
    const { userStateIndex, voiceCredits } = await MaciSignUp(
      store.state.ethersProvider,
      store.state.keyPair,
      store.state.poapTokenId
    )
    localStorage.setItem('userStateIndex', userStateIndex)
    localStorage.setItem('voiceCredits', voiceCredits)
    store.setState({ signedUp: true, balance: voiceCredits, userStateIndex })
    store.setState({ loading: false })
  },
  selectImage: (store, value) => {
    if (store.state.hasEligiblePOAPtokens !== true) return
    if (store.state.signedUp !== true) return
    store.setState({ selected: value })
  },
  incVote: (store, value) => {
    const voteRootValue = store.state.voteRootValue + 1
    const voteSquare = Math.pow(voteRootValue, 2)
    if (store.state.balance - voteSquare < 0) return
    store.setState({ voteRootValue, voteSquare })
  },
  decVote: (store, value) => {
    if (store.state.voteRootValue <= 1) return
    const voteRootValue = store.state.voteRootValue - 1
    const voteSquare = Math.pow(voteRootValue, 2)
    store.setState({ voteRootValue, voteSquare })
  },
  addToCart: (store, value) => {
    let { cart, selected, voteRootValue, voteSquare } = store.state
    cart.push({ type: 'vote', imageId: selected, voteRootValue, voteSquare })
    store.setState({
      cart: cart,
      selected: null,
      balance: store.state.balance - store.state.voteSquare,
      voteRootValue: 1,
      voteSquare: 1,
    })
  },
  removeFromCart: (store, value) => {
    let { cart } = store.state
    const [{ voteRootValue, voteSquare }] = cart.splice(value, 1)
    store.setState({ cart, balance: store.state.balance + (voteSquare || 0) })
  },
  vote: (store, value) => {
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
    // TODO update local storate balance
  },
  imBeingBribed: (store, value) => {
    store.setState({ bribedMode: !store.state.bribedMode })
  },
  changeKey: async ({ state, ...store }, value) => {
    const keyPair = new Keypair()
    // localStorage.setItem('macisk', keyPair.privKey.serialize())
    store.setState({ keyPair: keyPair })
    // alert(`Voting key changed to:\n${keyPair.pubKey.serialize()}`)
    // console.log('MACI key changed', keyPair.pubKey.serialize())
    // await MaciChangeKey(state.ethersProvider, state.keyPair, state.userStateIndex, BigInt(0))

    let { cart } = state
    cart.push({ type: 'keychange', keyPair })
    store.setState({ cart })
  },
  setLoading: (store, value) => {
    store.setState({ loading: value })
  },
  initImages: async store => {
    if (typeof window === 'undefined') return
    if (store.state.boxes.length > 0) return

    // TODO fetch existing images here:
    const BOXES = Array.from(Array(10)).map(_ => {
      const _size = (2 ^ random(1, 10)) * 20
      return {
        w: _size,
        h: _size,
        color: '#' + (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6),
      }
    })
    const { canvas, boxes } = pack(BOXES, 'maxrects')
    store.setState({ canvas, boxes })
  },
}

export default globalHook(React, initialState, actions)
