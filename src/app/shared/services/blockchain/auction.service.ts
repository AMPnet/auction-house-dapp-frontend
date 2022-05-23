import {Injectable} from '@angular/core'
import {combineLatest, from, of} from 'rxjs'
import {switchMap} from 'rxjs/operators'
import {Auction, Auction__factory} from '../../../../../types/ethers-contracts'
import {SessionQuery} from '../../../session/state/session.query'
import {PreferenceQuery} from '../../../preference/state/preference.query'
import {DialogService} from '../dialog.service'
import {GasService} from './gas.service'
import {SignerService} from '../signer.service'
import {BigNumber, Signer} from 'ethers'
import {IpfsService} from '../ipfs/ipfs.service'
import {Provider} from '@ethersproject/providers'
import {ErrorService} from '../error.service'

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  constructor(private sessionQuery: SessionQuery,
              private dialogService: DialogService,
              private gasService: GasService,
              private signerService: SignerService,
              private ipfsService: IpfsService,
              private errorService: ErrorService,
              private preferenceQuery: PreferenceQuery) {
  }

  contract(address: string, signerOrProvider: Signer | Provider): Auction {
    return Auction__factory.connect(address, signerOrProvider)
  }

  bid(auctionAddress: string, amount: BigNumber) {
    return this.signerService.ensureAuth.pipe(
      switchMap(signer => this.dialogService.waitingApproval(
        of(this.contract(auctionAddress, signer)).pipe(
          switchMap(contract => combineLatest([of(contract), this.gasService.overrides])),
          switchMap(([contract, overrides]) => contract.populateTransaction.bid(amount, overrides)),
          switchMap(tx => this.signerService.sendTransaction(tx)),
        ),
      )),
      switchMap(tx => this.dialogService.waitingTransaction(
        from(this.sessionQuery.provider.waitForTransaction(tx.hash)),
      )),
      this.errorService.handleError(false, true),
    )
  }

  withdraw(auctionAddress: string) {
    return this.signerService.ensureAuth.pipe(
      switchMap(signer => this.dialogService.waitingApproval(
        of(this.contract(auctionAddress, signer)).pipe(
          switchMap(contract => combineLatest([of(contract), this.gasService.overrides])),
          switchMap(([contract, overrides]) => contract.populateTransaction.withdraw(overrides)),
          switchMap(tx => this.signerService.sendTransaction(tx)),
        ),
      )),
      switchMap(tx => this.dialogService.waitingTransaction(
        from(this.sessionQuery.provider.waitForTransaction(tx.hash)),
      )),
      this.errorService.handleError(false, true),
    )
  }
}
