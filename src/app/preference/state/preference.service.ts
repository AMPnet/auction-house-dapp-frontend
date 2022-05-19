import {Injectable} from '@angular/core'
import {catchError, concatMap, timeout} from 'rxjs/operators'
import {AuthProvider, PreferenceStore} from './preference.store'
import {EMPTY, Observable, of} from 'rxjs'
import {PreferenceQuery} from './preference.query'
import {SignerService} from '../../shared/services/signer.service'
import {MetamaskSubsignerService} from '../../shared/services/subsigners/metamask-subsigner.service'
import {WalletConnectSubsignerService} from '../../shared/services/subsigners/walletconnect-subsigner.service'
import {providers} from 'ethers'

@Injectable({providedIn: 'root'})
export class PreferenceService {
  constructor(private preferenceStore: PreferenceStore,
              private preferenceQuery: PreferenceQuery,
              private metamaskSubsignerService: MetamaskSubsignerService,
              private walletConnectSubsignerService: WalletConnectSubsignerService,
              private signer: SignerService) {
  }

  private get tryPreviousLogin(): Observable<providers.JsonRpcSigner | undefined> {
    return of(this.preferenceQuery.getValue()).pipe(
      concatMap(pref => {
        if (pref.address === '') {
          return EMPTY
        }
        switch (pref.authProvider) {
          case AuthProvider.METAMASK:
            return this.signer.login(this.metamaskSubsignerService, {force: false})
          case AuthProvider.WALLET_CONNECT:
            return this.signer.login(this.walletConnectSubsignerService, {force: false})
          default:
            return EMPTY
        }
      }),
    )
  }

  initSigner(): Observable<unknown> {
    return this.tryPreviousLogin.pipe(
      timeout(30_000),
      catchError((err) => {
        if (err === 'WRONG_NETWORK') return of(this.signer)

        return this.signer.logout().pipe(concatMap(() => EMPTY))
      }),
    )
  }
}
