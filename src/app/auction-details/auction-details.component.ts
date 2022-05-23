import {ChangeDetectionStrategy, Component} from '@angular/core'
import {SessionQuery} from '../session/state/session.query'
import {PreferenceQuery} from '../preference/state/preference.query'
import {Auction, QueryService} from '../shared/services/blockchain/query.service'
import {ActivatedRoute} from '@angular/router'
import {constants} from 'ethers'
import {Observable, switchMap} from 'rxjs'

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionDetailsComponent {
  address$ = this.preferenceQuery.address$

  auction$: Observable<Auction>

  constructor(private sessionQuery: SessionQuery,
              private preferenceQuery: PreferenceQuery,
              private route: ActivatedRoute,
              private queryService: QueryService) {
    const auctionAddress = this.route.snapshot.params.id

    this.auction$ = this.address$.pipe(
      switchMap(userAddress => this.queryService.getAuctionDetailsData(
          auctionAddress,
          userAddress || constants.AddressZero,
        ),
      ),
    )
  }
}
