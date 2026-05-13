
export class DateUtils {

  static daysAgo(date: string, numberOfDaysAgo: number) {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - numberOfDaysAgo);
    return this.formatDate(currentDate);
  }

  static formatDate(date: Date): string {
    return `${date.getFullYear()}-${DateUtils.addLeadingZeros(date.getMonth() + 1)}-${DateUtils.addLeadingZeros(date.getDate())}`;
  }

  static today(): string {
    return DateUtils.formatDate(new Date());
  }

  static addLeadingZeros(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }

}
