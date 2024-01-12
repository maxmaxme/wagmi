'use client'

import {
  type Config,
  type GetProofErrorType,
  type ResolvedRegister,
} from '@wagmi/core'
import type { Evaluate } from '@wagmi/core/internal'
import {
  type GetProofData,
  type GetProofOptions,
  type GetProofQueryKey,
  getProofQueryOptions,
} from '@wagmi/core/query'
import { type GetProofQueryFnData } from '@wagmi/core/query'

import {
  type ConfigParameter,
  type QueryParameter,
} from '../types/properties.js'
import { type UseQueryReturnType, useQuery } from '../utils/query.js'
import { useChainId } from './useChainId.js'
import { useConfig } from './useConfig.js'

export type UseProofParameters<
  config extends Config = Config,
  selectData = GetProofData,
> = Evaluate<
  GetProofOptions<config> &
    ConfigParameter<config> &
    QueryParameter<
      GetProofQueryFnData,
      GetProofErrorType,
      selectData,
      GetProofQueryKey
    >
>

export type UseProofReturnType<selectData = GetProofData> = UseQueryReturnType<
  selectData,
  GetProofErrorType
>

/** https://wagmi.sh/react/api/hooks/useProof */
export function useProof<
  config extends Config = ResolvedRegister['config'],
  selectData = GetProofData,
>(
  parameters: UseProofParameters<config, selectData> = {},
): UseProofReturnType<selectData> {
  const { address, storageKeys, query = {} } = parameters

  const config = useConfig(parameters)
  const chainId = useChainId()

  const options = getProofQueryOptions(config, {
    ...parameters,
    chainId: parameters.chainId ?? chainId,
  })
  const enabled = Boolean(address && storageKeys && (query.enabled ?? true))

  return useQuery({ ...query, ...options, enabled })
}