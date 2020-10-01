import { useState, useEffect } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import ENS from 'ethereum-ens'

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

export function formatAccAddress(fullAddress) {
  return fullAddress.substring(0, 6) + '...' + fullAddress.substring(fullAddress.length - 4, fullAddress.length)
}

export default function WalletConnectButton() {
  const [web3, setWeb3] = useState(false)
  const [provider, setProvider] = useState(false)
  const [address, setAddress] = useState(false)
  const [ensName, setEnsName] = useState(false)

  useEffect(() => {
    if (!provider) return
    // Subscribe to accounts change
    provider.on('accountsChanged', accounts => {
      console.log('accountsChanged', accounts)
      setAddress(accounts[0])
    })

    // Subscribe to chainId change
    provider.on('chainChanged', chainId => {
      console.log('chainChanged', chainId)
    })

    // Subscribe to provider connection
    provider.on('connect', info => {
      console.log('connect', info)
    })

    // Subscribe to provider disconnection
    provider.on('disconnect', error => {
      console.log('disconnect', error)
    })
  }, [provider])

  const connect = async _ => {
    const provider = await web3Modal.connect()
    const web3 = new Web3(provider)
    const ens = new ENS(provider)
    const [address] = await web3.eth.getAccounts()
    let ensName = null
    try {
      ensName = await ens.reverse(address).name()
      if (address != (await ens.resolver(ensName).addr())) {
        ensName = null
      }
    } catch (err) {}

    setWeb3(web3)
    setProvider(provider)
    setAddress(address)
    setEnsName(ensName)
  }

  if (web3Modal.cachedProvider && !web3) {
    connect()
  }

  if (address) {
    return (
      <a className='px-6 button'>
        <span className='inline-block mr-2 -ml-2 align-middle'>
          <Jazzicon diameter={25} seed={jsNumberForAddress(address)} />
        </span>
        {ensName || formatAccAddress(address)}
      </a>
    )
  } else {
    return (
      <a className='px-6 button' onClick={connect}>
        Connect Wallet
      </a>
    )
  }
}
