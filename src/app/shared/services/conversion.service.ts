import {Injectable} from '@angular/core'
import {BigNumber} from 'ethers'
import {formatUnits, parseUnits} from 'ethers/lib/utils'

@Injectable({
  providedIn: 'root',
})
export class ConversionService {
  constructor() {
  }

  toToken(amount: number | string, precision = 18): BigNumber {
    return parseUnits(String(amount), precision)
  }

  parseToken(value: BigNumber, precision = 18): string {
    return formatUnits(value, precision)
  }

  parseTokenToNumber(value: BigNumber, precision = 18): number {
    return Number(this.parseToken(value, precision))
  }

  scale(value: BigNumber, scaleValue: number, precision = 18): BigNumber {
    return value.mul(parseUnits(String(scaleValue), precision))
      .div(this.pow10(precision))
  }

  trim(value: BigNumber, decimals: number = 18, trimDecimals = 0): BigNumber {
    const totalDecimals = Math.max(decimals - trimDecimals, 0)

    return value
      .div(this.pow10(totalDecimals))
      .mul(this.pow10(totalDecimals))
  }

  private pow10(to: number): BigNumber {
    return parseUnits('1', to)
  }
}
