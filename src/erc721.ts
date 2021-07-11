import { BigInt } from "@graphprotocol/graph-ts"
import {
  ExitTokensCall,
  LockedERC721
} from "../generated/ERC721Predicate/ERC721Predicate"
// import { ExampleEntity } from "../generated/schema"
import { lockTokensERC721, lockTokensERC721Counter, exitTokensERC721, exitTokensERC721Counter } from "../generated/schema"

export function handleLockTokensErc721(event: LockedERC721): void {
  let counter = getLockTokensERC721Counter()
  let updated = counter.current.plus(BigInt.fromI32(1))
  counter.current = updated
  counter.save()

  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let lockTokens = new lockTokensERC721(id)
  lockTokens.transactionHash = event.transaction.hash.toHex()
  lockTokens.depositReceiver = event.params.depositReceiver
  lockTokens.rootToken = event.params.rootToken
  lockTokens.depositor = event.params.depositor
  lockTokens.tokenId = event.params.tokenId
  lockTokens.counter = updated
  lockTokens.save()
}

export function handleExitTokensErc721(call: ExitTokensCall): void {
  let counter = getExitTokensERC721Counter()
  let updated = counter.current.plus(BigInt.fromI32(1))
  counter.current = updated
  counter.save()

  let id = call.transaction.hash.toHex()
  let exitTokens = new exitTokensERC721(id)
  exitTokens.transactionHash = call.transaction.hash.toHex()
  exitTokens.withdrawer = call.inputs.withdrawer
  exitTokens.rootToken = call.inputs.rootToken
  exitTokens.log = call.inputs.log
  exitTokens.counter = updated
  exitTokens.save()
}

function getExitTokensERC721Counter(): exitTokensERC721Counter {
  // Only one entry will be kept in this entity
  let id = 'exit-tokens-erc721-counter'
  let entity = exitTokensERC721Counter.load(id)
  if (entity == null) {

    entity = new exitTokensERC721Counter(id)
    entity.current = BigInt.fromI32(0)

  }
  return entity as exitTokensERC721Counter
}


function getLockTokensERC721Counter(): lockTokensERC721Counter {
  // Only one entry will be kept in this entity
  let id = 'lock-tokens-erc721-eventcounter'
  let entity = lockTokensERC721Counter.load(id)
  if (entity == null) {

    entity = new lockTokensERC721Counter(id)
    entity.current = BigInt.fromI32(0)

  }
  return entity as lockTokensERC721Counter
}
