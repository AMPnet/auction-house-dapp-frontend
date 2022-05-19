import {ChangeDetectionStrategy, Component} from '@angular/core'
import {Observable, of} from 'rxjs'
import {SessionQuery} from '../../session/state/session.query'
import {AppLayoutStore} from '../state/app-layout.store'
import {AppLayoutQuery} from '../state/app-layout.query'
import {filter, map, tap} from 'rxjs/operators'
import {SignerService} from '../../shared/services/signer.service'
import {PreferenceQuery} from '../../preference/state/preference.query'
import {TailwindService} from '../../shared/services/tailwind.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  isLoggedIn$ = this.sessionQuery.isLoggedIn$
  isDropdownOpen$ = this.appLayoutQuery.isDropdownMenuOpen$
  isMobileScreen$: Observable<boolean>
  dropdownCloser$: Observable<unknown>

  navbarScreenLinks: NavbarItem[] = [
    // {title: 'Admin', routerLink: '/admin', showItem: this.isAdmin$},
  ]

  constructor(private sessionQuery: SessionQuery,
              private preferenceQuery: PreferenceQuery,
              private appLayoutStore: AppLayoutStore,
              private appLayoutQuery: AppLayoutQuery,
              private signerService: SignerService,
              private tailwindService: TailwindService) {
    this.isMobileScreen$ = this.tailwindService.screenResize$.pipe(
      map(screen => screen === ('sm' || 'md')),
    )
    this.dropdownCloser$ = this.isMobileScreen$.pipe(
      filter(isMobile => !isMobile),
      tap(() => this.appLayoutStore.closeDropdownMenu()),
    )
  }

  login(): Observable<unknown> {
    return this.signerService.ensureAuth.pipe(
      tap(() => this.appLayoutStore.closeDropdownMenu()),
    )
  }

  logout(): Observable<unknown> {
    return this.signerService.logout()
  }

  toggleDropdown(): Observable<unknown> {
    return of(this.appLayoutStore.toggleDropdownMenu())
  }
}

interface NavbarItem {
  title: string,
  routerLink?: string,
  showItem: Observable<boolean>,
}
