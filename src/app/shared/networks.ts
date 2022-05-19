import {providers} from 'ethers'
import ReconnectingWebSocket from 'reconnecting-websocket'

export enum ChainID {
  MUMBAI_TESTNET = 80001, // Polygon Testnet
}

export interface Network {
  chainID: ChainID,
  name: string,
  shortName: string,
  nativeCurrency: {
    name: string,
    symbol: string;
  },
  maxGasPrice: number,
  rpcURLs: string[],
  wssRpcURLs?: string[],
  explorerURLs: string[],
  appConfig: AppConfig,
}

interface AppConfig {
  // TODO: set app config
}

export const MumbaiNetwork: Network = {
  chainID: ChainID.MUMBAI_TESTNET,
  name: 'Mumbai (Polygon Testnet)',
  shortName: 'mumbai',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
  },
  maxGasPrice: 20,
  rpcURLs: ['https://rpc-mumbai.maticvigil.com'],
  wssRpcURLs: [
    'wss://ws-nd-673-584-255.p2pify.com/6eba79da2c02fb3ca5985cc6e95ebd53',
    'wss://polygon-mumbai.g.alchemy.com/v2/w8tKRA88CQYBQEwGO2HlKKHtSD_qHOoU',
    'wss://ws-matic-mumbai.chainstacklabs.com',
  ],
  explorerURLs: ['https://mumbai.polygonscan.com/'],
  appConfig: {},
}

export const Networks: { [key in ChainID]: Network } = {
  [ChainID.MUMBAI_TESTNET]: MumbaiNetwork,
}

const getEthersNetwork = (network: Network): providers.Network => ({
  name: network.shortName,
  chainId: network.chainID,
  _defaultProvider: (_providers: any) => {
    if (network.wssRpcURLs?.[0]) {
      return new providers.WebSocketProvider(new ReconnectingWebSocket(network.wssRpcURLs![0]) as any, network.chainID)
    }

    return new providers.StaticJsonRpcProvider(network.rpcURLs[0], network.chainID)
  },
})

export const EthersNetworks = Object.fromEntries(Object.entries(Networks)
  .map((entry) => [entry[0], getEthersNetwork(entry[1])]),
)
