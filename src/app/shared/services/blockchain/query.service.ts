import {Injectable} from '@angular/core'
import {combineLatest, Observable} from 'rxjs'
import {map, switchMap} from 'rxjs/operators'
import {QueryService__factory} from '../../../../../types/ethers-contracts'
import {SessionQuery} from '../../../session/state/session.query'
import {PreferenceQuery} from '../../../preference/state/preference.query'
import {DialogService} from '../dialog.service'
import {GasService} from './gas.service'
import {SignerService} from '../signer.service'
import {IQueryService} from '../../../../../types/ethers-contracts/QueryService'

@Injectable({
  providedIn: 'root',
})
export class QueryService {
  contract$ = combineLatest([
    this.preferenceQuery.network$,
    this.preferenceQuery.address$,
    this.sessionQuery.provider$,
  ]).pipe(
    map(([network, _address, provider]) =>
      QueryService__factory.connect(network.appConfig.queryService, provider)),
  )

  constructor(private sessionQuery: SessionQuery,
              private dialogService: DialogService,
              private gasService: GasService,
              private signerService: SignerService,
              private preferenceQuery: PreferenceQuery) {
  }

  auctionHouse$: Observable<AuctionHouse> = combineLatest([
    this.contract$,
  ]).pipe(
    switchMap(([contract]) =>
      contract.getAuctionHouseData(
        this.preferenceQuery.network.appConfig.auctionHouseService,
      )),
  )

  getAuctionDetailsData(auctionAddress: string, bidder: string): Observable<Auction> {
    return this.contract$.pipe(
      switchMap(contract =>
        contract.getAuctionDetailsData(auctionAddress, bidder),
      ),
    )
  }
}

type AuctionHouse = IQueryService.AuctionHouseDataStructOutput
export type Auction = IQueryService.AuctionDetailsDataStructOutput
