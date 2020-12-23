import { ethers } from 'ethers'
import { MACI_ADDRESS } from 'libs/constants'
import MACIABI from 'abi/MACI.abi.json'

export default async function signUp(address, provider) {
  const ethersProvider = new ethers.providers.Web3Provider(provider)
  const MaciContract = new ethers.Contract(MACI_ADDRESS, MACIABI, ethersProvider)

  const args = {}

  const tx = await MaciContract.signUp(args)

  const stateIndex = getEventArg(contributionTxReceipt, maci, 'SignUp', '_stateIndex')
  const voiceCredits = getEventArg(contributionTxReceipt, maci, 'SignUp', '_voiceCreditBalance')
}
