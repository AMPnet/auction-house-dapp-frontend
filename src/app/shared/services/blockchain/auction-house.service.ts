import {Injectable} from '@angular/core'
import {combineLatest, from, Observable, of} from 'rxjs'
import {first, map, switchMap} from 'rxjs/operators'
import {
  AuctionHouseService as ContractAHService,
  AuctionHouseService__factory,
} from '../../../../../types/ethers-contracts'
import {SessionQuery} from '../../../session/state/session.query'
import {PreferenceQuery} from '../../../preference/state/preference.query'
import {DialogService} from '../dialog.service'
import {GasService} from './gas.service'
import {SignerService} from '../signer.service'
import {BigNumberish} from 'ethers'
import {IpfsService} from '../ipfs/ipfs.service'
import {IPFSAuction} from '../../../../../types/ipfs/auction'
import {IPFSAddResult} from '../ipfs/ipfs.service.types'

@Injectable({
  providedIn: 'root',
})
export class AuctionHouseService {
  factoryContract$: Observable<ContractAHService> = this.sessionQuery.provider$.pipe(
    map(provider => AuctionHouseService__factory.connect(
      this.preferenceQuery.network.appConfig.auctionHouseService, provider,
    )),
  )

  constructor(private sessionQuery: SessionQuery,
              private dialogService: DialogService,
              private gasService: GasService,
              private signerService: SignerService,
              private ipfsService: IpfsService,
              private preferenceQuery: PreferenceQuery) {
  }

  createAuction(data: CreateAuctionData) {
    return combineLatest([
      this.signerService.ensureAuth,
      this.factoryContract$,
    ]).pipe(
      first(),
      map(([signer, contract]) => contract.connect(signer)),
      switchMap(contract => combineLatest([of(contract), this.gasService.overrides])),
      switchMap(([contract, overrides]) => {
        return from(contract.populateTransaction.createAuction(
          data.name,
          data.infoHash,
          data.auctionToken,
          data.beneficiary,
          data.minBid,
          data.duration,
          overrides,
        )).pipe(
          switchMap(tx => this.signerService.sendTransaction(tx)),
          switchMap(tx => this.dialogService.loading(
            from(this.sessionQuery.provider.waitForTransaction(tx.hash)),
            'Processing transaction...',
          )),
        )
      }),
    )
  }

  uploadInfo(data: Partial<AuctionUploadInfoData>, campaign?: IPFSAuction): Observable<IPFSAddResult> {
    return combineLatest([
      this.ipfsService.addText(data.description || ''),
    ]).pipe(
      switchMap(([descriptionIPFS]) => this.ipfsService.addObject<IPFSAuction>({
        version: 0.1,
        description: descriptionIPFS.path || campaign?.description || '',
      })),
    )
  }
}

interface CreateAuctionData {
  name: string,
  infoHash: string,
  auctionToken: string,
  beneficiary: string,
  minBid: BigNumberish,
  duration: BigNumberish,
}

interface AuctionUploadInfoData {
  description: string
}
