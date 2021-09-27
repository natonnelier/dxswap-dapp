import { BigNumber } from 'ethers'
import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useBridge } from '../../hooks/useArbBridge'
import { addBridgeTxn, updateBridgeTxnPartnerHash, updateBridgeTxnReceipt } from './actions'

import { useBridgePendingTransactions, useBridgeL1Deposits, useBridgeTransactions } from './hooks'
import { txnTypeToLayer } from './reducer'
import { BridgeTxn } from './types'

export default function Updater(): null {
  const {
    bridge,
    chainIdPair: { l1ChainId, l2ChainId }
  } = useBridge()
  const dispatch = useDispatch()

  const allTransactions = useBridgeTransactions()
  const depositTransactions = useBridgeL1Deposits()
  const pendingTransactions = useBridgePendingTransactions()

  // Pending updater
  const getReceipt = useCallback(
    (tx: BridgeTxn) => {
      const provider = txnTypeToLayer(tx.type) === 2 ? bridge?.l2Provider : bridge?.l1Provider
      if (!provider) throw new Error('No provider on bridge')

      return provider.getTransactionReceipt(tx.txHash)
    },
    [bridge?.l1Provider, bridge?.l2Provider]
  )

  const pendingTxListener = useCallback(async () => {
    if (!pendingTransactions.length) return
    const receipts = await Promise.all(pendingTransactions.map(getReceipt))
    receipts.forEach((txReceipt, index) => {
      if (txReceipt) {
        dispatch(
          updateBridgeTxnReceipt({
            chainId: pendingTransactions[index].chainId,
            txHash: txReceipt.transactionHash,
            receipt: txReceipt
          })
        )
      }
    })
  }, [dispatch, getReceipt, pendingTransactions])

  useEffect(() => {
    const intervalId = setInterval(pendingTxListener, 5000)
    return () => clearInterval(intervalId)
  }, [l1ChainId, l2ChainId, pendingTxListener])

  // Deposits updater

  const getL2TxnHash = useCallback(
    async (txn: BridgeTxn) => {
      if (!bridge || !l2ChainId) {
        return null
      }
      let seqNum: BigNumber
      if (txn.seqNum) {
        seqNum = BigNumber.from(txn.seqNum)
      } else {
        const rec = await bridge.l1Provider.getTransactionReceipt(txn.txHash)
        const seqNumArray = await bridge.getInboxSeqNumFromContractTransaction(rec)
        if (!seqNumArray || seqNumArray.length === 0) {
          return null
        }
        ;[seqNum] = seqNumArray
      }
      const l2ChainIdBN = BigNumber.from(l2ChainId)
      const retryableTicketHash = await bridge.calculateL2TransactionHash(seqNum, l2ChainIdBN)

      return {
        retryableTicketHash,
        seqNum
      }
    },
    [bridge, l2ChainId]
  )

  const l2DepositsListener = useCallback(async () => {
    const depositHashes = await Promise.all(depositTransactions.map(getL2TxnHash))
    if (!l1ChainId || !l2ChainId) return

    depositTransactions.forEach((txn, index) => {
      const txnHash = depositHashes[index]
      if (txnHash === null) {
        return
      }

      const { retryableTicketHash, seqNum } = txnHash

      if (!allTransactions[l1ChainId]?.[retryableTicketHash] && !allTransactions[l2ChainId]?.[retryableTicketHash]) {
        dispatch(
          addBridgeTxn({
            ...txn,
            receipt: undefined,
            chainId: l2ChainId,
            type: 'deposit-l2',
            txHash: retryableTicketHash,
            seqNum: seqNum.toNumber(),
            blockNumber: undefined
          })
        )

        dispatch(
          updateBridgeTxnPartnerHash({
            chainId: l2ChainId,
            txHash: retryableTicketHash,
            partnerTxHash: txn.txHash,
            partnerChainId: l1ChainId
          })
        )
      }
    })
  }, [allTransactions, depositTransactions, dispatch, getL2TxnHash, l1ChainId, l2ChainId])

  useEffect(() => {
    const intervalId = window.setInterval(l2DepositsListener, 5000)
    return () => window.clearInterval(intervalId)
  }, [l1ChainId, l2ChainId, l2DepositsListener])

  return null
}