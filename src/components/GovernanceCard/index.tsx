import { darken } from 'polished'
import React from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'

import Card from '../Card'
import { RowBetween } from '../Row'
import Column from '../Column'
import { AutoRow } from '../Row'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const HoverCard = styled(Card)`
  border: 1px solid transparent;
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.bg2)};
  }
`
const CardWrapper = styled(Column)`
  position: relative;
  align-items: center;
  justify-content: center;
  background: rgba(20, 19, 29, 0.75);
  backdrop-filter: blur(24px);
  border-radius: 4px;
  min-height: 96px;
  overflow: hidden;
  cursor: pointer;
  z-index: 10;
`

const TokenIconSM = styled.img`
  width: 20px;
  height: 20px;
`

interface GovernanceCardProps {
  image: any
  pairCount: number
  proposalCount: number
  description: string
  onClick: () => void
}

export function GovernanceCard({ image, pairCount, proposalCount, description, onClick }: GovernanceCardProps) {
  const getSubTitle = () => {
    if (proposalCount > 0 && pairCount <= 0) return `${proposalCount} PROPOSALS`
    if (pairCount > 0 && proposalCount <= 0) return `${pairCount} PAIRS`
    if (pairCount <= 0 && proposalCount <= 0) return null
    return `${pairCount} PAIRS | ${proposalCount} PROPOSALS`
  }

  return (
    <CardWrapper onClick={onClick}>
      <AutoRow justify="center">
        <TokenIconSM src={image} style={{ marginRight: 6 }} />
        <Text fontSize={16} fontWeight={600} lineHeight="20px">
          {description}
        </Text>
      </AutoRow>
      {getSubTitle() && (
        <Text fontSize={9} fontWeight={600} lineHeight="11px" style={{ marginTop: 7 }}>
          {getSubTitle()}
        </Text>
      )}
    </CardWrapper>
  )
}