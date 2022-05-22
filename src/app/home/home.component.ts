import {ChangeDetectionStrategy, Component} from '@angular/core'
import {SessionQuery} from '../session/state/session.query'
import {PreferenceQuery} from '../preference/state/preference.query'
import {QueryService} from '../shared/services/blockchain/query.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  isLoggedIn$ = this.sessionQuery.isLoggedIn$
  address$ = this.preferenceQuery.address$

  auctionHouse$ = this.queryService.auctionHouse$

  constructor(private sessionQuery: SessionQuery,
              private preferenceQuery: PreferenceQuery,
              private queryService: QueryService) {
  }
}
