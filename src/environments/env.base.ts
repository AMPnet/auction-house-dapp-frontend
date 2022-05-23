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
    pinataApiToken: postBuildEnv?.IPFS_PINATA_API_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmYjQzOWVjOC0wZmFhLTQzYjgtOGM1OS1kY2MyM2VlYmIwZTMiLCJlbWFpbCI6Im1hdGlqYUBhbXBuZXQuaW8iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MH1dLCJ2ZXJzaW9uIjoxLCJsYXN0X21pZ3JhdGVkIjoxNjI4Nzc0MTUwMDc0fSwibWZhX2VuYWJsZWQiOmZhbHNlfSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMGZjMTY4NjExOGM5MmM5YWVlMmIiLCJzY29wZWRLZXlTZWNyZXQiOiIwZDc2ODIyOWI0OWFiZWRkNjBjZGJlOWJlYmNhMmRkOTk0NGE2MWE5NWVkOGEzNWY1OGNjYjk5MDIwY2ZlMzE3IiwiaWF0IjoxNjUzMDUzNjU0fQ.AF7lwr4_fWgERFVVJdiXWyx0IZDgQbMkD0Qeo7BfEFQ',
  },
  fixed: {
    chainID: postBuildEnv?.FIXED_CHAIN_ID ? Number(postBuildEnv?.FIXED_CHAIN_ID) : MumbaiNetwork.chainID,
  },
}
