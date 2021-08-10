import {Pipe, PipeTransform} from '@angular/core';
import {Amount} from './amount';
import {Language} from '../../../core';

@Pipe({name: 'amount'})
export class AmountPipe implements PipeTransform {
  transform(value: number | null, language: Language, currency: string): string {
    if (value) {
      return AmountPipe.formatAmount(new Amount(value, language), currency);
    }
    return '0';
  }

  private static formatAmount(convertedAmount: Amount, currency: string): string {
    switch (currency.toLowerCase()) {
      case 'sek':
      case 'dkk':
      case 'nok':
      case 'isk':
        return `${convertedAmount.format} kr`;
      case 'usd':
      case 'aud':
      case 'cad':
      case 'hkd':
      case 'mxn':
      case 'nzd':
      case 'sgd':
        return `$${convertedAmount.format}`;
      case 'eur':
        return `€${convertedAmount.format}`;
      case 'gbp':
        return `£${convertedAmount.format}`;
      case 'jpy':
      case 'cny':
        return `¥${convertedAmount.format}`;
      case 'brl':
        return `R$${convertedAmount.format}`;
      case 'czk':
        return `${convertedAmount.format} Kč`;
      case 'hrk':
        return `${convertedAmount.format} kn`;
      case 'bgn':
        return `${convertedAmount.format} лв`;
      case 'huf':
        return `${convertedAmount.format} Ft`;
      case 'idr':
        return `Rp${convertedAmount.format}`;
      case 'ils':
        return `₪${convertedAmount.format}`;
      case 'inr':
        return `₹${convertedAmount.format}`;
      case 'krw':
        return `₩${convertedAmount.format}`;
      case 'myr':
        return `RM${convertedAmount.format}`;
      case 'php':
        return `₱${convertedAmount.format}`;
      case 'pln':
        return `${convertedAmount.format} zł`;
      case 'ron':
        return `${convertedAmount.format} lei`;
      case 'rub':
        return `${convertedAmount.format} ₽`;
      case 'thb':
        return `${convertedAmount.format} ฿`;
      case 'try':
        return `₺${convertedAmount.format}`;
      case 'zar':
        return `R ${convertedAmount.format}`;
      default:
        return `${convertedAmount.format} ${currency.toUpperCase()}`;
    }
  }
}
