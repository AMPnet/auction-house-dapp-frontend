import {Injectable, Pipe, PipeTransform} from '@angular/core'
import {Observable} from 'rxjs'
import {Erc20Service, ERC20TokenData} from '../services/blockchain/erc20.service'

@Injectable({
  providedIn: 'root',
})
@Pipe({
  name: 'assetData',
})
export class AssetDataPipe implements PipeTransform {
  constructor(private erc20Service: Erc20Service) {
  }

  transform(value: any, opt?: 'tokenOnly'): Observable<ERC20TokenData> {
    return this.erc20Service.getData(value)
  }
}
