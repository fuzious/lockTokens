import { BigInt } from "@graphprotocol/graph-ts"
import {
  LockedBatchERC1155, ExitTokensCall
} from "../generated/ERC1155Predicate/ERC1155Predicate"
// import { ExampleEntity } from "../generated/schema"
import { lockTokensERC1155, lockTokensERC1155Counter, exitTokensERC1155, exitTokensERC1155Counter } from "../generated/schema"

export function handleLockTokensErc1155(event: LockedBatchERC1155): void {
  let counter = getLockTokensERC1155Counter()
  let updated = counter.current.plus(BigInt.fromI32(1))
  counter.current = updated
  counter.save()

  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let lockTokens = new lockTokensERC1155(id)
  lockTokens.transactionHash = event.transaction.hash.toHex()
  lockTokens.depositReceiver = event.params.depositReceiver
  lockTokens.rootToken = event.params.rootToken
  lockTokens.depositor = event.params.depositor
  lockTokens.ids = event.params.ids
  lockTokens.amounts = event.params.amounts
  lockTokens.save()
}

export function handleExitTokensErc1155(call: ExitTokensCall): void {
  let counter = getExitTokensERC1155Counter()
  let updated = counter.current.plus(BigInt.fromI32(1))
  counter.current = updated
  counter.save()

  let id = call.transaction.hash.toHex()
  let exitTokens = new exitTokensERC1155(id)
  exitTokens.transactionHash = call.transaction.hash.toHex()
  exitTokens.withdrawer = call.inputs.withdrawer
  exitTokens.rootToken = call.inputs.rootToken
  exitTokens.log = call.inputs.log
  exitTokens.counter = updated
  exitTokens.save()
}

function getExitTokensERC1155Counter(): exitTokensERC1155Counter {
  // Only one entry will be kept in this entity
  let id = 'exit-tokens-erc1155-counter'
  let entity = exitTokensERC1155Counter.load(id)
  if (entity == null) {

    entity = new exitTokensERC1155Counter(id)
    entity.current = BigInt.fromI32(0)

  }
  return entity as exitTokensERC1155Counter
}


function getLockTokensERC1155Counter(): lockTokensERC1155Counter {
  // Only one entry will be kept in this entity
  let id = 'lock-tokens-erc1155-eventcounter'
  let entity = lockTokensERC1155Counter.load(id)
  if (entity == null) {

    entity = new lockTokensERC1155Counter(id)
    entity.current = BigInt.fromI32(0)

  }
  return entity as lockTokensERC1155Counter
}
