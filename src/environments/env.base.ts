import {PostBuildEnv, PreBuildEnv} from '../../types/env'
import {getWindow} from '../app/shared/utils/browser'
import {MumbaiNetwork} from '../app/shared/networks'

const preBuildEnv = process.env as unknown as PreBuildEnv
const postBuildEnv = getWindow().env as PostBuildEnv

export const environment = {
  production: false,
  commitHash: preBuildEnv.COMMIT_HASH,
  appVersion: preBuildEnv.APP_VERSION,
  ipfs: {
    apiURL: postBuildEnv?.IPFS_API_URL || 'https://ipfs.infura.io:5001',
    gatewayURL: postBuildEnv?.IPFS_API_URL || 'https://ampnet.mypinata.cloud',
    pinataApiURL: postBuildEnv?.IPFS_PINATA_API_URL || 'https://api.pinata.cloud',
    pinataApiToken: postBuildEnv?.IPFS_PINATA_API_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmYjQzOWVjOC0wZmFhLTQzYjgtOGM1OS1kY2MyM2VlYmIwZTMiLCJlbWFpbCI6ImV1Z2VuQGFtcG5ldC5pbyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2V9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJhMmRmNGJhYzZiZDhkNmQxYmFlYiIsInNjb3BlZEtleVNlY3JldCI6IjIzNWYzODg1MmYxNWExODY2YWJiYTc1Y2I5OTlhNWU4ZjAwZjUxMWRlNDQwNGIyOWYyZjgxNzRjYzhhMWI3OTkiLCJpYXQiOjE2Mjc4OTkzODl9.3BRf9auEMW4evy6G72Y_tHOytKD_E0UYf8T_11DJfx4'
  },
  fixed: {
    chainID: postBuildEnv?.FIXED_CHAIN_ID ? Number(postBuildEnv?.FIXED_CHAIN_ID) : MumbaiNetwork.chainID,
  },
}
