import {ChangeDetectionStrategy, Component} from '@angular/core'
import {SessionQuery} from '../session/state/session.query'
import {PreferenceQuery} from '../preference/state/preference.query'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  isLoggedIn$ = this.sessionQuery.isLoggedIn$
  address$ = this.preferenceQuery.address$

  constructor(private sessionQuery: SessionQuery,
              private preferenceQuery: PreferenceQuery) {
  }
}
