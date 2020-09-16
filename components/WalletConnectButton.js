import { useState, useEffect } from 'react'

import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'

const web3Modal = new Web3Modal({
  network: 'mainnet', // optional
  cacheProvider: true, // optional
  providerOptions: {
    injected: {
      display: {},
      package: null,
    },
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: 'INFURA_ID', // required
      },
    },
  },
})

export default function WalletConnectButton() {
  const [web3, setWeb3] = useState(false)
  const [provider, setProvider] = useState(false)

  useEffect(
    _ => {
      if (!provider) return
      // Subscribe to accounts change
      provider.on('accountsChanged', accounts => {
        console.log(accounts)
      })

      // Subscribe to chainId change
      provider.on('chainChanged', chainId => {
        console.log(chainId)
      })

      // Subscribe to provider connection
      provider.on('connect', info => {
        console.log(info)
      })

      // Subscribe to provider disconnection
      provider.on('disconnect', error => {
        console.log(error)
      })
    },
    [provider]
  )

  const connect = async _ => {
    console.log('connect btn clicked ')
    const provider = await web3Modal.connect()
    const web3 = new Web3(provider)
    setProvider(provider)
    setWeb3(web3)
    console.log({ provider, web3 })
  }

  return (
    <a className='px-6 button' onClick={connect}>
      Connect Wallet
    </a>
  )
}
