export enum Package {
  Free = 'Free',
  Starter = 'Starter',
  Standard = 'Standard',
  Premium = 'Premium',
}

export const PACKAGES: { value: Package; label: string }[] = [
  {
    value: Package.Free,
    label: 'Darmowy',
  },
  {
    value: Package.Starter,
    label: 'Starter',
  },
  {
    value: Package.Standard,
    label: 'Standard',
  },
  {
    value: Package.Premium,
    label: 'Premium',
  },
];

export interface ProfileForm {
  userName: string;
  email: string;
  createdAt: string;
  notificationsEnabled: boolean;
  currentPackage: Package;
  paymentEndDate: string;
  isTrail: boolean;
  trailEndDate: string;
}
