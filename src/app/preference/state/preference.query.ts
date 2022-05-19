import {Injectable} from '@angular/core'
import {Query} from '@datorama/akita'
import {PreferenceState, PreferenceStore} from './preference.store'
import {map} from 'rxjs/operators'
import {Networks} from '../../shared/networks'

@Injectable({providedIn: 'root'})
export class PreferenceQuery extends Query<PreferenceState> {
  address$ = this.select('address')
  authProvider$ = this.select('authProvider')
  network$ = this.select('chainID').pipe(
    map(chainID => Networks[chainID]),
  )

  constructor(protected store: PreferenceStore) {
    super(store)
  }

  get network() {
    return Networks[this.getValue().chainID]
  }
}
