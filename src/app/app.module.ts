import {BrowserModule} from '@angular/platform-browser'
import {APP_INITIALIZER, NgModule} from '@angular/core'
import {combineLatest} from 'rxjs'

import {AppRoutingModule} from './app-routing.module'
import {AppComponent} from './app.component'
import {NG_ENTITY_SERVICE_CONFIG} from '@datorama/akita-ng-entity-service'
import {AkitaNgDevtools} from '@datorama/akita-ngdevtools'
import {AkitaNgRouterStoreModule} from '@datorama/akita-ng-router-store'
import {environment} from '../environments/environment'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {MatDialogModule} from '@angular/material/dialog'
import {ActionButtonComponent} from './shared/components/action-button/action-button.component'
import {AddrShortPipe} from './shared/pipes/addr-short.pipe'
import {InfoDialogComponent} from './shared/components/info-dialog/info-dialog.component'
import {PreferenceService} from './preference/state/preference.service'
import {AppLayoutComponent} from './app-layout/app-layout.component'
import {NavbarComponent} from './app-layout/navbar/navbar.component'
import {FooterComponent} from './app-layout/footer/footer.component'
import {A11yModule} from '@angular/cdk/a11y'
import {SpinnerComponent} from './shared/components/spinner/spinner.component'
import {ServiceWorkerModule} from '@angular/service-worker'
import {InlineAsyncComponent} from './shared/components/inline-async/inline-async.component'
import {UnwrapStatusPipe} from './shared/pipes/unwrap-status.pipe'
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe, ViewportScroller} from '@angular/common'
import {CurrencyDefaultPipe} from './shared/pipes/currency-default.pipe'
import {AuthComponent} from './auth/auth.component'
import {HttpClientModule} from '@angular/common/http'
import {AuthProviderNamePipe} from './shared/pipes/auth-provider-name.pipe'
import {ReactiveFormsModule} from '@angular/forms'
import {ValueCopyComponent} from './shared/components/value-copy/value-copy.component'
import {FileInputAccessorDirective} from './shared/directives/file-input-accessor.directive'
import {SafePipe} from './shared/pipes/safe.pipe'
import {FormatUnitPipe} from './shared/pipes/format-unit.pipe'
import {ToTextIpfsPipe} from './shared/pipes/to-text-ipfs.pipe'
import {ToUrlIPFSPipe} from './shared/pipes/to-url-ipfs.pipe'
import {WalletButtonComponent} from './app-layout/navbar/wallet-button/wallet-button.component'
import {MatTooltipModule} from '@angular/material/tooltip'
import {TruncatePipe} from './shared/pipes/truncate.pipe'
import {UnescapePipe} from './shared/pipes/unescape.pipe'
import {SelectNetworkComponent} from './shared/components/select-network/select-network.component'
import {HomeComponent} from './home/home.component'
import {Router, Scroll} from '@angular/router'
import {delay, filter} from 'rxjs/operators'
import {LoadingDialogComponent} from './shared/components/loading-dialog/loading-dialog.component'
import {MatSnackBarModule} from '@angular/material/snack-bar'
import {AddToMetamaskComponent} from './shared/components/add-to-metamask/add-to-metamask.component'
import {ExplorerLinkComponent} from './shared/components/explorer-link/explorer-link.component'
import {BigNumberInputDirective} from './shared/directives/bignumber-input.directive'
import {
  LoadingDialogApprovalComponent,
} from './shared/components/loading-dialog/loading-dialog-approval/loading-dialog-approval.component'
import {
  LoadingDialogTransactionComponent,
} from './shared/components/loading-dialog/loading-dialog-transaction/loading-dialog-transaction.component'
import {LoadingOverlayComponent} from './shared/components/loading-dialog/loading-overlay/loading-overlay.component'
import {AssetDataPipe} from './shared/pipes/asset-data.pipe'
import {WithStatusPipe} from './shared/pipes/with-status.pipe'
import {BlockTimePipe} from './shared/pipes/block-time.pipe'
import {WrongNetworkComponent} from './shared/components/wrong-network/wrong-network.component'
import {AuctionNewComponent} from './auction-new/auction-new.component'

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ActionButtonComponent,
    AddrShortPipe,
    UnwrapStatusPipe,
    InfoDialogComponent,
    AppLayoutComponent,
    FooterComponent,
    SpinnerComponent,
    InlineAsyncComponent,
    AuthComponent,
    CurrencyDefaultPipe,
    AuthProviderNamePipe,
    ToUrlIPFSPipe,
    SafePipe,
    FormatUnitPipe,
    ToTextIpfsPipe,
    ValueCopyComponent,
    AddToMetamaskComponent,
    ExplorerLinkComponent,
    FileInputAccessorDirective,
    WalletButtonComponent,
    TruncatePipe,
    UnescapePipe,
    AssetDataPipe,
    WithStatusPipe,
    BlockTimePipe,
    SelectNetworkComponent,
    HomeComponent,
    LoadingDialogComponent,
    BigNumberInputDirective,
    LoadingDialogApprovalComponent,
    LoadingDialogTransactionComponent,
    LoadingOverlayComponent,
    WrongNetworkComponent,
    AuctionNewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    ReactiveFormsModule,
    AkitaNgRouterStoreModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    A11yModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    PreferenceService,
    {
      provide: APP_INITIALIZER,
      useFactory: (pref: PreferenceService) =>
        () => combineLatest([pref.initSigner()]),
      multi: true,
      deps: [PreferenceService],
    },
    {
      provide: NG_ENTITY_SERVICE_CONFIG,
      useValue: {baseUrl: 'https://jsonplaceholder.typicode.com'},
    },
    CurrencyPipe,
    ToUrlIPFSPipe,
    TruncatePipe,
    UnescapePipe,
    PercentPipe,
    FormatUnitPipe,
    DatePipe,
    DecimalPipe,
  ],
  bootstrap: [AppComponent],
})

export class AppModule {
  constructor(router: Router, viewportScroller: ViewportScroller) {
    // Workaround for issue with scroll restoration
    // https://github.com/angular/angular/issues/24547#issuecomment-503076245
    router.events.pipe(
      filter((e: any): e is Scroll => e instanceof Scroll),
      delay(200),
    ).subscribe(e => {
      if (e.position) {
        // backward navigation
        viewportScroller.scrollToPosition(e.position)
      } else if (e.anchor) {
        // anchor navigation
        viewportScroller.scrollToAnchor(e.anchor)
      } else {
        // forward navigation
        viewportScroller.scrollToPosition([0, 0])
      }
    })
  }
}
