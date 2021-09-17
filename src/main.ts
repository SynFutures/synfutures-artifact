import * as ethereumConfig from './config/ethereum.json';
import * as kovanConfig from './config/kovan.json';
import * as polygonConfig from './config/polygon.json';
import * as bscConfig from './config/bsc.json';
import * as arbitrumConfig from './config/arbitrum.json';

import * as ethereumAsset from './asset/ethereum.json';
import * as kovanAsset from './asset/kovan.json';
import * as polygonAsset from './asset/polygon.json';
import * as bscAsset from './asset/bsc.json';
import * as arbitrumAsset from './asset/arbitrum.json';

import * as ERC20_ABI from './abi/ERC20.json';
import * as GLOBAL_CONFIG_ABI from './abi/GlobalConfig.json';
import * as AMM_ABI from './abi/Amm.json';
import * as FACTORY_ABI from './abi/Factory.json';
import * as READER_ABI from './abi/Reader.json';
import * as FUTURES_ABI from './abi/Futures.json';
import * as KOVAN_ERC20_ABI from './abi/Kovan_ERC20.json';
import * as BTCHASH_ORACLE_ABI from './abi/oracle/bitcoin-mining-tracker.json';
import { ChainConfig, PairConfigInfo } from './types/chainConfig';
import { CHAIN_ID, PRODUCT_TYPE } from './constants';
import { Token } from './types/token';
import util from 'util';

export {
  ethereumConfig,
  kovanConfig,
  polygonConfig,
  bscConfig,
  arbitrumConfig,
  ethereumAsset,
  kovanAsset,
  polygonAsset,
  bscAsset,
  arbitrumAsset,
  ERC20_ABI,
  GLOBAL_CONFIG_ABI,
  AMM_ABI,
  FACTORY_ABI,
  READER_ABI,
  FUTURES_ABI,
  KOVAN_ERC20_ABI,
  BTCHASH_ORACLE_ABI,
};

/**
 * get chain id by name
 * @param chain string
 * @returns
 */
export function getChainId(chain: string): CHAIN_ID {
  return CHAIN_ID[chain.toUpperCase()];
}

/**
 * get chain config by chain id
 * @param chainId
 * @returns
 */
export function getChainConfig(chainId: CHAIN_ID): ChainConfig {
  switch (chainId) {
    case CHAIN_ID.ETHEREUM: {
      return mapChainConfig(chainId, ethereumConfig);
    }
    case CHAIN_ID.BSC: {
      return mapChainConfig(chainId, bscConfig);
    }
    case CHAIN_ID.POLYGON: {
      return mapChainConfig(chainId, polygonConfig);
    }
    case CHAIN_ID.ARBITURM: {
      return mapChainConfig(chainId, arbitrumConfig);
    }
    case CHAIN_ID.KOVAN: {
      return mapChainConfig(chainId, kovanConfig);
    }
    default: {
      throw new Error('Unsupported Network.');
    }
  }
}

/**
 * map json object to ChainConfig
 * @param chainId
 * @param jsonConfig
 * @returns
 */
function mapChainConfig(chainId: CHAIN_ID, jsonConfig) {
  const config: ChainConfig = {
    ...jsonConfig,
    chainId: chainId,
    nativeToken: getToken(chainId, jsonConfig.nativeToken),
    chainParams: {
      margins: jsonConfig.chainParams.margins.map((symbol) => getToken(chainId, symbol)),
      dexFactory: jsonConfig.chainParams.dexFactory,
      globalConfig: jsonConfig.chainParams.globalConfig,
      chainlinkFeeders: jsonConfig.chainParams.chainlinkFeeders,
      products: jsonConfig.chainParams.products.map((productType: string) => PRODUCT_TYPE[productType.toUpperCase()]),
    },
    pairConfig: mapPairConfig(chainId, jsonConfig.pairConfig),
    contractAddress: jsonConfig.contractAddress,
  };
  return config;
}

function mapPairConfig(chainId: CHAIN_ID, pairConfig) {
  const result = {};
  for (const key of Object.keys(pairConfig)) {
    result[key] = mapPairConfigInfo(chainId, pairConfig[key]);
  }
  return result;
}

/**
 * map json object to PairConfig
 * @param chainId
 * @param config
 * @returns
 */
function mapPairConfigInfo(chainId: CHAIN_ID, config) {
  const pairConfig: PairConfigInfo = {
    name: config.name,
    baseTokens: config.baseTokens.map((symbol) => getToken(chainId, symbol)),
    quoteTokens: config.quoteTokens.map((symbol) => getToken(chainId, symbol)),
    default: config.default,
  };
  return pairConfig;
}

/**
 * get available assets on a specific chain
 * @param chainId
 * @returns
 */
export function getAssets(chainId: CHAIN_ID): Token[] {
  switch (chainId) {
    case CHAIN_ID.ETHEREUM: {
      const config: Token[] = ethereumAsset;
      return config;
    }
    case CHAIN_ID.BSC: {
      const config: Token[] = bscAsset;
      return config;
    }
    case CHAIN_ID.POLYGON: {
      const config: Token[] = polygonAsset;
      return config;
    }
    case CHAIN_ID.ARBITURM: {
      const config: Token[] = arbitrumAsset;
      return config;
    }
    case CHAIN_ID.KOVAN: {
      const config: Token[] = kovanAsset;
      return config;
    }
    default: {
      throw new Error('Unsupported Network.');
    }
  }
}

/**
 * get token info by symbol and network
 * @param chainId
 * @param symbol
 * @returns
 */
export function getToken(chainId: CHAIN_ID, symbol: string): Token {
  const assets = getAssets(chainId);
  for (const token of assets) {
    if (token.symbol.toUpperCase() === symbol.toUpperCase()) {
      return token;
    }
  }
  return undefined;
}

/**
 * get token info by address and network
 * @param chainId
 * @param address
 * @returns
 */
export function getTokenByAddress(chainId: CHAIN_ID, address: string): Token {
  const assets = getAssets(chainId);
  for (const token of assets) {
    if (token.address.toUpperCase() === address.toUpperCase()) {
      return token;
    }
  }
  return undefined;
}

/**
 * get infura rpc url
 * @param chainId
 * @param infuraKey
 * @returns
 */
export function getInfuraUrl(chainId: CHAIN_ID, infuraKey: string): string {
  let url = getChainConfig(chainId).infuraUrl;
  url = util.format(url, infuraKey);
  return url.split(' ')[0];
}

// const conf = getChainConfig(CHAIN_ID.KOVAN);
// console.info(PRODUCT_TYPE['Basic'.toUpperCase()]);
// console.info(JSON.stringify(conf));