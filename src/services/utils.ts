import ERC20 from '@connext/nxtp-contracts/artifacts/contracts/interfaces/IERC20Minimal.sol/IERC20Minimal.json'
import { IERC20Minimal } from '@connext/nxtp-contracts/typechain'
import { JsonRpcSigner } from '@ethersproject/providers'
import BigNumberJs from 'bignumber.js'
import { Contract } from 'ethers'
import { getChainById, Token, wrappedTokens } from '../types'

export const formatTokenAmount = (token: Token, amount: string | undefined) => {
  if (!amount) {
    return '- ' + token.symbol
  }

  return formatTokenAmountOnly(token, amount) + ' ' + token.symbol
}

export const formatTokenAmountOnly = (token: Token, amount: string | undefined) => {
  if (!amount) {
    return '0.0'
  }

  const floated = new BigNumberJs(amount).shiftedBy(-token.decimals)
  return floated.toFixed(4, 1)
}

export const checkWrappedTokenId = (chainId: number, tokenId: string) => {
  if (tokenId !== '0x0000000000000000000000000000000000000000') {
    return tokenId
  }

  return wrappedTokens[getChainById(chainId).key].id
}

export const deepClone = (src: any) => {
  return JSON.parse(JSON.stringify(src));
}

export const sleep = (mills: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, mills)
  })
}

export const getApproved = async (signer: JsonRpcSigner, tokenAddress: string, contractAddress: string) => {
  const signerAddress = await signer.getAddress()
  const erc20 = new Contract(tokenAddress, ERC20.abi, signer) as IERC20Minimal

  try {
    const approved = await erc20.allowance(signerAddress, contractAddress)
    return new BigNumberJs(approved.toString())
  } catch (e) {
    return new BigNumberJs(0)
  }
}

export const setApproval = async (signer: JsonRpcSigner, tokenAddress: string, contractAddress: string, amount: string) => {
  const erc20 = new Contract(tokenAddress, ERC20.abi, signer) as IERC20Minimal

  const tx = await erc20.approve(contractAddress, amount);
  return tx
}

