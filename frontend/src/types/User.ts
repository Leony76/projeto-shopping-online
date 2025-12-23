export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthday: string;

  recovery_email: string;
  recovery_phone: string;
  password?: string;

  public_place: string;
  zip_code: string;
  home_number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;

  wallet: string;
  admin: boolean;
};
