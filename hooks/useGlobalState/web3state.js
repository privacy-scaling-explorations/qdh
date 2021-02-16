import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { attendedEligiblePOAPEvents } from 'libs/getPoapEvents'
import { calcVotingDeadline } from 'libs/MACI'
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

const connect = async ({ setState, ...store }) => {
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
    const signer = ethersProvider.getSigner()
    let maci = new ethers.Contract(store.state.maciAddress, MACI_ABI, signer)
    setState({ maci })
    const { name: networkName } = await ethersProvider.getNetwork()
    if (networkName === 'homestead') {
      try {
        const ensName = await ethersProvider.lookupAddress(address)
        setState({ ensName })
      } catch (err) {}
      const poapMinEligibleYear = 2018
      const { eligible, poapTokenId } = await attendedEligiblePOAPEvents(address, provider, poapMinEligibleYear)
      setState({ hasEligiblePOAPtokens: eligible, poapTokenId })
    } else if (networkName === 'kovan') {
      if (store.state.maciAddressKovan) {
        maci = new ethers.Contract(store.state.maciAddressKovan, MACI_ABI, signer)
      }
      setState({ maci, hasEligiblePOAPtokens: true })
    } else {
      setState({ hasEligiblePOAPtokens: true })
    }
    const votingDeadline = await calcVotingDeadline(maci)
    setState({ votingDeadline })
    setState({ loading: false })
  }

  _handleAccountOrNetworkChange()

  if (!store.state.provider) {
    provider.on('accountsChanged', async accounts => {
      console.log('accountsChanged', accounts)
      _handleAccountOrNetworkChange()
    })

    // Subscribe to chainId change
    provider.on('chainChanged', chainId => {
      console.log('chainChanged', parseInt(chainId))
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
    maciAddress: MACI_ADDRESS,
    votingDeadline: null,
  },
  actions: {
    initWeb3: async ({ setState, ...store }, defaultProps) => {
      if (typeof window === 'undefined') return
      if (store.state.boxes.length < 1) {
        await store.actions.fetchConfig()
        store.actions.fetchImages()
      }
      if (web3Modal == null) {
        web3Modal = getWeb3Modal()
        if (web3Modal.cachedProvider) {
          store.actions.connect({ setState, ...store })
        } else {
          setState({ loading: false })
        }
      }
      setState({ loading: false })
    },
    setMaciAddress: ({ setState, ...store }, maciAddress) => {
      const signer = store.state.ethersProvider.getSigner()
      try {
        const maci = new ethers.Contract(maciAddress, MACI_ABI, signer)
        setState({ maci, maciAddress })
      } catch (error) {
        alert(`Doesnt look like a valid MACI address. Please try again`)
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
    resetSignupState: _ => {
      if (confirm(`This will reset your signup state data. You'll have to sign up again after this. You sure?`)) {
        localStorage.removeItem('userStateIndex')
        localStorage.removeItem('voiceCredits')
        localStorage.removeItem('howtoPopUpWasShown')
        window.location.reload()
      }
    },
  },
}
