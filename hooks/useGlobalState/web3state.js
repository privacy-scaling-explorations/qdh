import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { attendedEligiblePOAPEvents } from 'libs/getPoapEvents'
import { MACI_ADDRESS } from 'libs/constants'
import MACI_ABI from 'abi/MACI.abi.json'

let web3Modal = null

const getWeb3Modal = () =>
  new Web3Modal({
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

const connect = async ({ setState, ...state }) => {
  setState({ loading: true })
  if (web3Modal === null && typeof window !== 'undefined') {
    web3Modal = getWeb3Modal()
  }

  const provider = await web3Modal.connect()
  const ethersProvider = new ethers.providers.Web3Provider(provider)
  setState({ provider, ethersProvider })

  const _handleAccountOrNetworkChange = async _ => {
    setState({ loading: true })
    const address = await ethersProvider.getSigner().getAddress()
    setState({ address })
    const { chainId } = await ethersProvider.getNetwork()
    if (chainId === 1337) {
      /* local or private chain */
      setState({ hasEligiblePOAPtokens: true })
    } else {
      const ensName = await ethersProvider.lookupAddress(address)
      setState({ ensName })
      const { eligible, poapTokenId } = await attendedEligiblePOAPEvents(address, provider)
      setState({ hasEligiblePOAPtokens: eligible, poapTokenId })
    }
    setState({ loading: false })
  }

  _handleAccountOrNetworkChange()

  if (!state.provider) {
    provider.on('accountsChanged', async accounts => {
      console.log('accountsChanged', accounts)
      _handleAccountOrNetworkChange()
    })

    // Subscribe to chainId change
    provider.on('chainChanged', chainId => {
      console.log('chainChanged', chainId)
      _handleAccountOrNetworkChange()
    })

    // Subscribe to provider connection
    provider.on('connect', info => {
      console.log('connect', info)
    })

    // Subscribe to provider disconnection
    provider.on('disconnect', error => {
      console.log('disconnect', error)
    })
  }
}

export default {
  initialState: {
    address: null,
    ensName: null,
    provider: null,
    ethersProvider: null,
    hasEligiblePOAPtokens: null,
  },
  actions: {
    initWeb3: async ({ setState, ...store }) => {
      if (typeof window !== 'undefined') {
        store.actions.initImages()
      }
      if (typeof window !== 'undefined' && web3Modal == null) {
        web3Modal = getWeb3Modal()

        if (web3Modal.cachedProvider) {
          store.actions.connect({ setState, ...store })
        } else {
          setState({ loading: false })
        }
      }
    },
    connect: connect,
    logout: async ({ setState }) => {
      setState({
        address: null,
        ensName: null,
        provider: null,
        ethersProvider: null,
      })
      web3Modal && (await web3Modal.clearCachedProvider())
    },
  },
}
