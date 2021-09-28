import React from 'react'
import { AdvancedDetailsFooter } from '../../components/AdvancedDetailsFooter'
import { HideableAutoColumn, HideableAutoColumnProps } from '../../components/Column'
import { Table, Th } from '../../components/Table'
import { BridgeTransactionSummary } from '../../state/bridgeTransactions/hooks'
import { TYPE } from '../../theme'
import { BridgeStatusTag } from './BridgeStatusTag'

interface BridgeTransactionsSummaryProps extends HideableAutoColumnProps {
  transactions: BridgeTransactionSummary[]
}

export const BridgeTransactionsSummary = ({ show, transactions }: BridgeTransactionsSummaryProps) => {
  return (
    <HideableAutoColumn show={show}>
      <AdvancedDetailsFooter fullWidth padding="16px">
        <Table>
          <thead>
            <tr>
              <Th>Bridging</Th>
              <Th align="left">From</Th>
              <Th align="left">To</Th>
              <Th align="left">Status</Th>
            </tr>
          </thead>
          <tbody>
            {Object.values(transactions).map((tx, index) => {
              const { assetName, fromName, status, toName, value } = tx

              return (
                <tr key={index} style={{ lineHeight: '22px' }}>
                  <td>
                    <TYPE.main color="white" fontSize="14px" lineHeight="14px" fontWeight="600">
                      {`${value} ${assetName}`}
                    </TYPE.main>
                  </td>
                  <td align="left">
                    <TYPE.main color="text4" fontSize="10px" lineHeight="12px" paddingLeft="9px">
                      {fromName}
                    </TYPE.main>
                  </td>
                  <td align="left">
                    <TYPE.main color="text4" fontSize="10px" lineHeight="12px" paddingLeft="9px">
                      {toName}
                    </TYPE.main>
                  </td>
                  <td align="left">
                    <BridgeStatusTag status={status} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </AdvancedDetailsFooter>
    </HideableAutoColumn>
  )
}