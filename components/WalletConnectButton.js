import { useState, useEffect } from 'react'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Ens from 'ethereum-ens'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import Dropdown from 'components/Dropdown'

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
      getEnsName({ address: accounts[0], provider })
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
    const [address] = await web3.eth.getAccounts()
    setWeb3(web3)
    setProvider(provider)
    setAddress(address)
    getEnsName({ address, provider })
  }

  const logout = async _ => {
    setWeb3(null)
    setAddress(null)
    setEnsName(null)
  }

  const getEnsName = async ({ address, provider }) => {
    const ens = new Ens(provider)
    let ensName = null
    try {
      ensName = await ens.reverse(address).name()
      if (address != (await ens.resolver(ensName).addr())) {
        ensName = null
      }
    } catch (err) {}
    setEnsName(ensName)
    return ensName
  }

  if (web3Modal.cachedProvider && !web3 && !provider) {
    connect()
  }

  if (address) {
    return (
      <Dropdown
        trigger={
          <a className='px-6 pl-10 button'>
            <span className='absolute' style={{ top: '2px', left: '14px' }}>
              <Jazzicon diameter={20} seed={jsNumberForAddress(address)} />
            </span>
            {ensName || formatAccAddress(address)}
          </a>
        }>
        <a
          className='block px-4 py-2 text-sm leading-5 text-gray-700 text-red-600 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
          role='menuitem'
          onClick={logout}>
          Log out
        </a>
      </Dropdown>
    )
  } else {
    return (
      <a className='px-6 button' onClick={connect}>
        Connect Wallet
      </a>
    )
  }
}
