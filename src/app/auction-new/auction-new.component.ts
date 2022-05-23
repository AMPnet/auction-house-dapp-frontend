import {ChangeDetectionStrategy, Component} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {PreferenceQuery} from '../preference/state/preference.query'
import {DialogService} from '../shared/services/dialog.service'
import {switchMap, tap} from 'rxjs/operators'
import {ConversionService} from '../shared/services/conversion.service'
import {AuctionHouseService} from '../shared/services/blockchain/auction-house.service'
import {Router} from '@angular/router'

@Component({
  selector: 'app-auction-new',
  templateUrl: './auction-new.component.html',
  styleUrls: ['./auction-new.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionNewComponent {
  createForm: FormGroup

  constructor(private preferenceQuery: PreferenceQuery,
              private dialogService: DialogService,
              private router: Router,
              private conversion: ConversionService,
              private auctionHouseService: AuctionHouseService,
              private fb: FormBuilder) {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      auctionToken: ['', [Validators.required]],
      beneficiary: ['', [Validators.required]],
      minBid: [0, [Validators.required, Validators.min(0)]],
      duration: [0, [Validators.required, Validators.min(0)]],
    })
  }

  create() {
    return this.auctionHouseService.uploadInfo(
      this.createForm.value.description,
    ).pipe(
      switchMap(uploadRes => this.auctionHouseService.createAuction({
        name: this.createForm.value.name,
        infoHash: uploadRes.path,
        auctionToken: this.createForm.value.auctionToken,
        beneficiary: this.createForm.value.beneficiary,
        minBid: this.createForm.value.minBid,
        duration: this.createForm.value.duration,
      })),
      switchMap(() => this.dialogService.success({
        message: 'Auction has been created.',
      }).pipe(
        tap(() => this.router.navigate([`/`])),
      )),
    )
  }
}
