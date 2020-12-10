import { useState, useEffect } from 'react'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Ens from 'ethereum-ens'
import { attendedEligiblePOAPEvents } from 'libs/getPoapEvents'

export default function useWeb3(options = {}) {
  let web3Modal = {}
  if (typeof window !== 'undefined') {
    web3Modal = new Web3Modal({
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
  }
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

  useEffect(async () => {
    if (address && provider) {
      const hasEligiblePOAPtokens = await attendedEligiblePOAPEvents(address, provider)
      console.log('hasEligiblePOAPtokens', hasEligiblePOAPtokens)
    }
  }, [address, provider])

  const connect = async _ => {
    const provider = await web3Modal.connect()
    const web3 = new Web3(provider)
    const [address, ...otherAdrresses] = await web3.eth.getAccounts()
    setWeb3(web3)
    setProvider(provider)
    setAddress(address)
    getEnsName({ address, provider })
  }

  const logout = async _ => {
    setWeb3(null)
    setAddress(null)
    setEnsName(null)
    await web3Modal.clearCachedProvider()
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

  return {
    address,
    ensName,
    web3,
    connect,
    logout,
  }
}
