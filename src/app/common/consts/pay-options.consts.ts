export enum PaymentPeriod {
  Everytime,
  Monthly,
  Semesterly,
}

export const PAY_OPTIONS: { value: PaymentPeriod; label: string }[] = [
  {
    value: PaymentPeriod.Everytime,
    label: 'Po zajeciach',
  },
  {
    value: PaymentPeriod.Monthly,
    label: 'Miesięczne',
  },
  {
    value: PaymentPeriod.Semesterly,
    label: 'Semestralne',
  },
];
