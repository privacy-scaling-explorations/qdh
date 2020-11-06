import Web3 from 'web3'
import { POAP_CONTRACT_ADDRESS } from 'libs/constants'
import ERC721ABI from 'abi/ERC721.abi.json'

export default async function getPOAPEvents(address, provider) {
  const web3 = new Web3(provider)
  const PoapContract = new web3.eth.Contract(ERC721ABI, POAP_CONTRACT_ADDRESS)
  const proxy = PoapContract.methods
  const attendedEvents = []
  let tokensAmount

  try {
    tokensAmount = parseInt(await proxy.balanceOf(address).call())
  } catch (err) {
    console.error(err)
    return []
  }

  for (let i = 0; i < tokensAmount; i++) {
    const { tokenId } = await proxy.tokenDetailsOfOwnerByIndex(address, i).call()
    const tokenURI = await proxy.tokenURI(tokenId).call()
    const poapEvent = await (await fetch(tokenURI)).json()
    attendedEvents.push(poapEvent)
  }

  return attendedEvents
}

export async function attendedEligiblePOAPEvents(address, provider) {
  const events = await getPOAPEvents(address, provider)
  let eligible = false

  events.forEach(event => {
    if (event.year > 2018) {
      eligible = true
    }
  })

  return eligible
}
