import { ethers } from 'ethers'
import { POAP_ADDRESS } from 'libs/constants'
import ERC721ABI from 'abi/ERC721.abi.json'

export default async function getPOAPEvents(address, provider) {
  const attendedEvents = []

  const ethersProvider = new ethers.providers.Web3Provider(provider)
  const PoapContract = new ethers.Contract(POAP_ADDRESS, ERC721ABI, ethersProvider)

  let tokensAmount

  try {
    tokensAmount = parseInt(await PoapContract.balanceOf(address))
  } catch (err) {
    console.error(err)
    return []
  }

  for (let i = 0; i < tokensAmount; i++) {
    const { tokenId } = await PoapContract.tokenDetailsOfOwnerByIndex(address, i)
    const tokenURI = await PoapContract.tokenURI(tokenId)
    const poapEvent = await (await fetch(tokenURI)).json()
    attendedEvents.push(poapEvent)
  }

  return attendedEvents
}

export async function attendedEligiblePOAPEvents(address, provider) {
  const events = await getPOAPEvents(address, provider)
  let eligible = false

  events.forEach(event => {
    if (event.year >= 2018) {
      eligible = true
    }
  })

  return eligible
}
