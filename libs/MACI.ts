import { ethers, Contract, providers } from 'ethers'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { MACI_ADDRESS } from 'libs/constants'
import { Command, Keypair } from 'maci-domainobjs'
import { genRandomSalt } from 'maci-crypto'
import MACI_ABI from 'abi/MACI.abi.json'

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

export async function calcSignUpDeadline(ethersProvider: providers.Web3Provider) {
  const signer = ethersProvider.getSigner()
  const maci = new ethers.Contract(MACI_ADDRESS, MACI_ABI, signer)

  const tx = await maci.calcSignUpDeadline()
  console.log(tx)
  return tx
}

export async function signUp(ethersProvider: providers.Web3Provider, keypair: Keypair, poapTokenId: number) {
  const signer = ethersProvider.getSigner()
  const maci = new ethers.Contract(MACI_ADDRESS, MACI_ABI, signer)

  const tx = await maci.signUp(
    keypair.pubKey.asContractParam(),
    [
      /* signUpGatekeeperData: POAP tokenId */
      ethers.utils.defaultAbiCoder.encode(['uint256'], [poapTokenId]),
    ],
    [
      /* initialVoiceCreditProxyData empty */
    ]
  )

  const userStateIndex = parseInt(await getEventArg(tx, maci, 'SignUp', '_stateIndex'))
  const voiceCredits = parseInt(await getEventArg(tx, maci, 'SignUp', '_voiceCreditBalance'))

  return { userStateIndex, voiceCredits }
}

export async function changeKey(ethersProvider: providers.Web3Provider, keypair: Keypair) {
  const signer = ethersProvider.getSigner()
  const maci = new ethers.Contract(MACI_ADDRESS, MACI_ABI, signer)

  // const command = new Command([])

  const tx = await maci.publishMessage(
    keypair.pubKey.asContractParam(),
    [
      /* signUpGatekeeperData: POAP tokenId */
    ],
    [
      /* initialVoiceCreditProxyData */
    ]
  )

  return {}
}

export async function publish(ethersProvider: any, keypair: Keypair) {
  const signer = ethersProvider.getSigner()
  const maci = new ethers.Contract(MACI_ADDRESS, MACI_ABI, signer)

  // TODO https://github.com/appliedzkp/maci/blob/master/contracts/ts/__tests__/PublishMessage.test.ts#L83
  const _stateIndex = BigInt(0)
  const _voteOptionIndex = BigInt(0)
  const _nonce = BigInt(0)

  const command = new Command(_stateIndex, keypair.pubKey, _voteOptionIndex, BigInt(0), _nonce, genRandomSalt())
  const signature = command.sign(keypair.privKey)
  const message = command.encrypt(signature, BigInt(0))

  const tx = await maci.publishMessage(
    message.asContractParam(),
    keypair.pubKey.asContractParam(),
    [
      /* signUpGatekeeperData: POAP tokenId */
    ],
    [
      /* initialVoiceCreditProxyData */
    ]
  )
  const receipt = await tx.wait()
  return receipt
}
