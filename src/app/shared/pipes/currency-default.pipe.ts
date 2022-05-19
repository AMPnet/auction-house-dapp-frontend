import {CurrencyPipe, DecimalPipe} from '@angular/common'
import {Injectable, Pipe, PipeTransform} from '@angular/core'

@Injectable({
  providedIn: 'root',
})
@Pipe({
  name: 'currencyDefault',
})
export class CurrencyDefaultPipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe,
              private decimalPipe: DecimalPipe) {
  }

  transform(
    value: number | string,
    symbol: string,
  ) {
    return `${this.decimalPipe.transform(value, '1.0-2')} ${symbol}`
  }
}
