import { ChainId } from '@swapr/sdk'
import React, { useEffect, useState } from 'react'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useNetworkSwitcherPopoverToggle } from '../../state/application/hooks'
import { TYPE } from '../../theme'
import { shortenAddress } from '../../utils'
import Loader from '../Loader'
import NetworkSwitcherPopover from '../NetworkSwitcherPopover'
import { RowBetween } from '../Row'
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import XDAILogo from '../../assets/images/xdai-stake-logo.png'
import ArbitrumLogo from '../../assets/images/arbitrum-logo.jpg'
import { TriangleIcon } from '../Icons'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { CustomNetworkConnector } from '../../connectors/CustomNetworkConnector'
import { InjectedConnector } from '@web3-react/injected-connector'

const ChainLogo: any = {
  [ChainId.MAINNET]: EthereumLogo,
  [ChainId.RINKEBY]: EthereumLogo,
  [ChainId.ARBITRUM_ONE]: ArbitrumLogo,
  [ChainId.ARBITRUM_RINKEBY]: ArbitrumLogo,
  [ChainId.XDAI]: XDAILogo
}

const ChainLabel: any = {
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ARBITRUM_ONE]: 'Arbitrum One',
  [ChainId.ARBITRUM_RINKEBY]: 'Arbitrum Rinkeby',
  [ChainId.XDAI]: 'xDai'
}

const View = styled.div`
  height:33px;
  display: flex;
  align-items: center;
  margin-left: auto;
  background-color: ${({ theme }) => theme.dark1};
  color: ${({ theme }) => theme.purple2};
  border-radius: 8px;
  white-space: nowrap;
  margin-left: 6px;

`

const Web3StatusConnected = styled.button<{ pending?: boolean }>`
  padding: 0 10px 0 12px;
  background: none;
  border: none;
  color: ${({ pending, theme }) => (pending ? theme.white : theme.text4)};
  font-weight: 700;
  font-size: 11px;
  line-height: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  outline: none;
`

const Web3StatusNetwork = styled.button<{ pendingTransactions?: boolean; isConnected: boolean; clickable: boolean }>`
  display: flex;
  align-items: center;
  padding: 7px 8px 7px 10px;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ffffff;
  height:33px;
  border-radius: 8px;
  background-color: ${({ theme, isConnected }) => (isConnected ? theme.dark2 : 'transparent')};
  cursor: ${props => (props.clickable ? 'pointer' : 'initial')};
  border:2px solid ${({ theme }) =>  theme.dark1 };
  border-left:none;
`

const IconWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;

  & > img,
  span {
    height: 20px;
    
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: center;
  `};
`

const NetworkName = styled.div`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`

const AddressDesktop = styled.span`
  display: block;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`

const AddressMobile = styled.span`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: block;
  `};
`

interface AccountStatusProps {
  pendingTransactions: string[]
  ENSName?: string
  account: string | undefined | null
  connector: AbstractConnector | undefined
  networkConnectorChainId: ChainId | undefined
  onAddressClick: () => void
}

export function AccountStatus({
  pendingTransactions,
  ENSName,
  account,
  connector,
  networkConnectorChainId,
  onAddressClick
}: AccountStatusProps) {
  const hasPendingTransactions = !!pendingTransactions.length
  const toggleNetworkSwitcherPopover = useNetworkSwitcherPopoverToggle()
  const [networkSwitchingActive, setNetworkSwitchingActive] = useState(false)

  useEffect(() => {
    setNetworkSwitchingActive(connector instanceof CustomNetworkConnector || connector instanceof InjectedConnector)
  }, [connector])

  if (!networkConnectorChainId) return null

  return (
    <View>
      {account && (
        <Web3StatusConnected id="web3-status-connected" onClick={onAddressClick} pending={hasPendingTransactions}>
          {hasPendingTransactions ? (
            <RowBetween>
              <Text fontSize={13} marginRight="5px">
                {pendingTransactions?.length} Pending
              </Text>{' '}
              <Loader />
            </RowBetween>
          ) : (
            ENSName || (
              <>
                <AddressDesktop>{shortenAddress(account)}</AddressDesktop>
                <AddressMobile>{shortenAddress(account, 2)}</AddressMobile>
              </>
            )
          )}
        </Web3StatusConnected>
      )}
      <NetworkSwitcherPopover>
        <Web3StatusNetwork
          clickable={networkSwitchingActive}
          onClick={networkSwitchingActive ? toggleNetworkSwitcherPopover : undefined}
          isConnected={!!account}
        >
          <IconWrapper>
            <img src={ChainLogo[networkConnectorChainId]} alt="chain logo" />
          </IconWrapper>
          {account && (
            <NetworkName>
              <TYPE.white ml="8px" fontWeight={700} fontSize="12px">
                {ChainLabel[networkConnectorChainId]}
              </TYPE.white>
            </NetworkName>
          )}
          {networkSwitchingActive && <TriangleIcon />}
        </Web3StatusNetwork>
      </NetworkSwitcherPopover>
    </View>
  )
}
