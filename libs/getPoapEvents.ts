import { ethers, providers } from 'ethers'
import { POAP_ADDRESS } from 'libs/constants'
import ERC721ABI from 'abi/ERC721.abi.json'

export default async function getPOAPEvents(address: string, provider: any): Promise<any[]> {
  const ethersProvider = new ethers.providers.Web3Provider(provider)
  const PoapContract = new ethers.Contract(POAP_ADDRESS, ERC721ABI, ethersProvider)
  const attendedEvents: any[] = []
  let tokensAmount: number

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
    poapEvent.tokenId = tokenId
    attendedEvents.push(poapEvent)
  }
  return attendedEvents
}

export async function attendedEligiblePOAPEvents(
  address: string,
  provider: providers.Web3Provider
): Promise<{ eligible: boolean; poapTokenId: number }> {
  let eligible: boolean = false
  let poapTokenId: number = 0
  const events = await getPOAPEvents(address, provider)
  events.forEach(event => {
    if (event.year >= 2018) {
      eligible = true
      poapTokenId = event.tokenId
    }
  })
  return { eligible, poapTokenId }
}
