import axios from 'axios'
import { CoinKey, findDefaultCoin, getChainById, Token } from '../types'

export interface TokenListToken {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

export interface TokenList {
  name: string
  timestamp: string
  version: {
    major: number
    minor: number
    patch: number
  }
  tags: any
  logoURI: string
  keywords: Array<string>
  tokens: Array<TokenListToken>
}

export const loadTokenList = async (chainId: number) : Promise<TokenList> => {
  const chain = getChainById(chainId)
  if (!chain.exchange) {
    throw new Error('No token list defined for chain')
  }
  const result = await axios.get(chain.exchange?.tokenlistUrl)
  return result.data as TokenList
}

export const loadTokenListAsTokens = async (chainId: number) : Promise<Array<Token>> => {
  const chain = getChainById(chainId)
  const tokenList = await loadTokenList(chainId)
  const filteredTokens = tokenList.tokens.filter(token => token.chainId === chainId)
  const mappedTokens = filteredTokens.map((token) => {
    return {
      id: token.address.toLowerCase(),
      symbol: token.symbol,
      decimals: token.decimals,
      chainId: token.chainId,
      name: token.name.replace(' on xDai', ''),
      logoURI: token.logoURI,

      chainKey: chain.key,
      key: token.symbol as CoinKey,
    } as Token
  })
  mappedTokens.unshift(findDefaultCoin(chain.coin).chains[chain.key])
  return mappedTokens
}
