import { ethers, Contract, providers } from 'ethers'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { Command, Keypair, PubKey } from 'maci-domainobjs'
import { genRandomSalt } from 'maci-crypto'

async function getEventArg(
  transaction: TransactionResponse,
  contract: Contract,
  eventName: string,
  argumentName: string
): Promise<any> {
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

export async function calcVotingDeadline(maci: Contract): Promise<number> {
  try {
    const tx = await maci.calcVotingDeadline()
    return parseInt(tx)
  } catch (err) {
    console.error(`Couldn't connect to MACI`, err)
    return 0
  }
}

// TODO 2 get results from tally.json
export async function getResults() {}

export async function signUp(
  // ethersProvider: providers.Web3Provider,
  maci: Contract,
  keypair: Keypair,
  poapTokenId: number
): Promise<{ userStateIndex: number; voiceCredits: number }> {
  // const signer = ethersProvider.getSigner()
  // const maci = new ethers.Contract(MACI_ADDRESS, MACI_ABI, signer)
  const tx = await maci.signUp(
    keypair.pubKey.asContractParam(),
    [ethers.utils.defaultAbiCoder.encode(['uint256'], [poapTokenId])],
    [
      /* initialVoiceCreditProxyData: empty */
    ]
  )
  const userStateIndex = parseInt(await getEventArg(tx, maci, 'SignUp', '_stateIndex'))
  const voiceCredits = parseInt(await getEventArg(tx, maci, 'SignUp', '_voiceCreditBalance'))
  return { userStateIndex, voiceCredits }
}

export async function publish(
  // ethersProvider: providers.Web3Provider,
  maci: Contract,
  keypair: Keypair,
  stateIndex: BigInt,
  voteOptionIndex: BigInt,
  voteWeight: BigInt,
  nonce: BigInt
): Promise<any> {
  // const signer = ethersProvider.getSigner()
  // const maci = new ethers.Contract(MACI_ADDRESS, MACI_ABI, signer)

  // TODO https://github.com/appliedzkp/maci/blob/master/contracts/ts/__tests__/PublishMessage.test.ts#L83
  const coordinatorPubKey = PubKey.unserialize('macipk.4ba3aa2718d5e3741aa643217722cf4a480854dfae544837d4af332f0c2b4586')
  const command = new Command(stateIndex, keypair.pubKey, voteOptionIndex, voteWeight, nonce, genRandomSalt())
  const signature = command.sign(keypair.privKey)
  const sharedKey = Keypair.genEcdhSharedKey(keypair.privKey, coordinatorPubKey)
  const message = command.encrypt(signature, sharedKey)
  try {
    const tx = await maci.publishMessage(message.asContractParam(), keypair.pubKey.asContractParam())
    const receipt = await tx.wait()
    return receipt
  } catch (err) {
    alert(err.data?.message || err.message)
    throw new Error(err)
  }
}

export async function changeKey(
  // ethersProvider: providers.Web3Provider,
  maci: Contract,
  keypair: Keypair,
  stateIndex: BigInt,
  nonce: BigInt
): Promise<any> {
  const receipt = await publish(maci, keypair, stateIndex, BigInt(0), BigInt(0), nonce)
  return receipt
}
