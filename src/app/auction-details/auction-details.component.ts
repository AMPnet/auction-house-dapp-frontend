import {ChangeDetectionStrategy, Component, ɵmarkDirty} from '@angular/core'
import {SessionQuery} from '../session/state/session.query'
import {PreferenceQuery} from '../preference/state/preference.query'
import {Auction, QueryService} from '../shared/services/blockchain/query.service'
import {ActivatedRoute, Router} from '@angular/router'
import {BigNumber, constants} from 'ethers'
import {BehaviorSubject, combineLatest, Observable, of, switchMap, timer} from 'rxjs'
import {catchError, debounceTime, distinctUntilChanged, map, shareReplay, startWith, take, tap} from 'rxjs/operators'
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors} from '@angular/forms'
import {DialogService} from '../shared/services/dialog.service'
import {Erc20Service, ERC20TokenData} from '../shared/services/blockchain/erc20.service'
import {ConversionService} from '../shared/services/conversion.service'
import {AuctionService} from '../shared/services/blockchain/auction.service'

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionDetailsComponent {
  address$ = this.preferenceQuery.address$

  auction$: Observable<Auction>
  refreshAuctionSub = new BehaviorSubject<void>(undefined)
  timeNow$ = timer(0, 1000).pipe(
    map(() => Date.now()),
  )

  bidForm: FormGroup
  bidState$: Observable<BidState | undefined>
  shouldApprove$: Observable<boolean>
  shouldBid$: Observable<boolean>
  shouldWithdraw$: Observable<boolean>

  constructor(private sessionQuery: SessionQuery,
              private preferenceQuery: PreferenceQuery,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private erc20Service: Erc20Service,
              private conversion: ConversionService,
              private auctionService: AuctionService,
              private dialogService: DialogService,
              private router: Router,
              private queryService: QueryService) {
    const auctionAddress = this.route.snapshot.params.id

    this.auction$ = combineLatest([
      this.refreshAuctionSub.asObservable(),
      this.address$,
    ]).pipe(
      switchMap(([_, userAddress]) => this.queryService.getAuctionDetailsData(
          auctionAddress,
          userAddress || constants.AddressZero,
        ),
      ),
    )

    this.bidForm = this.fb.group({
      amount: [''],
    }, {
      asyncValidators: this.amountValidator.bind(this),
    })

    const amountChanged$ = this.bidForm.get('amount')!.valueChanges.pipe(
      startWith(this.bidForm.value.amount),
      distinctUntilChanged((p, c) => p == c),
      shareReplay(1),
    )

    const token$ = this.auction$.pipe(
      switchMap(auction => this.erc20Service.getData(auction.auctionToken).pipe(
          catchError(() => of(undefined)),
        ),
      ),
    )

    this.bidState$ = token$.pipe(
      switchMap(tokenData => !!tokenData ? combineLatest([
        of(auctionAddress),
        of(tokenData),
        this.erc20Service.getAllowance$(
          tokenData.address, auctionAddress,
        ),
        this.erc20Service.tokenBalance$(tokenData.address),
      ]).pipe(
        map(([auctionAddress, tokenData, allowance, balance]) =>
          ({auctionAddress, tokenData, allowance, balance}),
        ),
      ) : of(undefined)),
      shareReplay(1),
    )

    this.shouldApprove$ = combineLatest([
      this.bidState$,
      amountChanged$,
    ]).pipe(
      map(([state, controlTokenAmount]) => {
        if (!state || !state.balance) return false

        const amount = this.conversion.toToken(controlTokenAmount || 0, state.tokenData.decimals)

        if (state.balance.lt(amount)) return false

        return state.allowance.lt(amount)
      }),
      distinctUntilChanged(),
    )

    this.shouldWithdraw$ = combineLatest([
      this.auction$,
    ]).pipe(
      map(([auction]) => auction.pendingReturnsAmount.gt(constants.Zero)),
      distinctUntilChanged(),
    )

    this.shouldBid$ = combineLatest([
      this.shouldApprove$,
    ]).pipe(
      map(([shouldApprove]) => {
        return !shouldApprove
      }),
      distinctUntilChanged(),
    )
  }

  private amountValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!this.bidState$) return of(null)

    return combineLatest([this.bidState$]).pipe(
      debounceTime(300),
      take(1),
      map(([data]) => {
        if (!data) return {noToken: true}

        const tokenAmount = this.conversion.toToken(control.value.amount || 0, data.tokenData.decimals)

        if (tokenAmount.lte(constants.Zero)) {
          return {tokenAmountBelowZero: true}
        } else if (tokenAmount.gt(data.balance!)) {
          return {tokenAmountAboveBalance: true}
        }

        return null
      }),
      tap(() => ɵmarkDirty(this)),
    )
  }

  approveAmount(state: BidState) {
    return () => {
      const tokenAmount = this.conversion.toToken(this.bidForm.value.amount || 0, state.tokenData.decimals)

      return this.erc20Service.approveAmount(
        state.tokenData.address,
        state.auctionAddress,
        tokenAmount,
      )
    }
  }

  createBid(state: BidState) {
    return () => {
      const tokenAmount = this.conversion.toToken(this.bidForm.value.amount || 0, state.tokenData.decimals)

      return this.auctionService.bid(state.auctionAddress, tokenAmount).pipe(
        switchMap(() => this.dialogService.success({
          message: 'Bid has been placed.',
        })),
        tap(() => this.refreshAuctionSub.next()),
      )
    }
  }

  withdraw(auctionAddress: string) {
    return () => {
      return this.auctionService.withdraw(auctionAddress).pipe(
        switchMap(() => this.dialogService.success({
          message: 'Bid has been withdrawn.',
        })),
        tap(() => this.refreshAuctionSub.next()),
      )
    }
  }
}

interface BidState {
  auctionAddress: string,
  tokenData: ERC20TokenData,
  allowance: BigNumber,
  balance: BigNumber | undefined,
}

