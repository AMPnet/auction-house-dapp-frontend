import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import {HomeComponent} from './home/home.component'
import {AppLayoutComponent} from './app-layout/app-layout.component'
import {AuctionNewComponent} from './auction-new/auction-new.component'

const routes: Routes = [
  {
    path: '', component: AppLayoutComponent, children: [
      {path: '', pathMatch: 'full', redirectTo: 'home'},
      {path: 'home', component: HomeComponent},
      {path: 'auctions/new', component: AuctionNewComponent},
    ],
  },
  {path: '**', redirectTo: '/home'},
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    // enableTracing: this, // enable for testing purposes
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
