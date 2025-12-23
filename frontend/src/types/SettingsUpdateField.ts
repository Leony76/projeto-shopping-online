import type { User } from "./User";

export const fieldMap = {
  "Nome": "name",
  "E-mail": "email",
  "Telefone": "phone",
  "Data de nascimento": "birthday",

  "Telefone de recuperação": "recovery_phone",
  "E-mail de recuperação": "recovery_email",
  "Senha": "password",

  "Logradouro" : "public_place",
  "CEP" : "zip_code",
  "Número de residência" : "home_number",
  "Complemento" : "complement",
  "Bairro" : "neighborhood",
  "Cidade" : "city",
  "Estado" : "state",
  "País" : "country",
} as const;

export type Field = keyof typeof fieldMap;
export type FieldKey = (typeof fieldMap)[Field] & keyof User;

export type FieldType = 'text' | 'password' | 'number' | 'email' | 'tel' | 'date';
