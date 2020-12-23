import { ethers } from 'ethers'
import { MACI_ADDRESS } from 'libs/constants'
import MACI_ABI from 'abi/MACI.abi.json'

async function getEventArg(transaction, contract, eventName, argumentName) {
  const receipt = await transaction.wait()
  for (const log of receipt.logs || []) {
    if (log.address != contract.address) {
      continue
    }
    const event = contract.interface.parseLog(log)
    if (event && event.name === eventName) {
      return event.args[argumentName]
    }
  }
  throw new Error('Event not found')
}

export async function calcSignUpDeadline(ethersProvider) {
  const signer = ethersProvider.getSigner()
  const maci = new ethers.Contract(MACI_ADDRESS, MACI_ABI, signer)

  const tx = await maci.calcSignUpDeadline()
  console.log(tx)
  return tx
}

export async function signUp(ethersProvider, keyPair) {
  const signer = ethersProvider.getSigner()
  const maci = new ethers.Contract(MACI_ADDRESS, MACI_ABI, signer)

  const tx = await maci.signUp(
    keyPair.pubKey.asContractParam(),
    [
      /* signUpGatekeeperData: POAP tokenId */
    ],
    [
      /* initialVoiceCreditProxyData */
    ]
  )

  const userStateIndex = parseInt(await getEventArg(tx, maci, 'SignUp', '_stateIndex'))
  const voiceCredits = parseInt(await getEventArg(tx, maci, 'SignUp', '_voiceCreditBalance'))

  return { userStateIndex, voiceCredits }
}

export default { signUp }
