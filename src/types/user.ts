export type ApiPerson = {
  firstName?: string | null;
  lastName?: string | null;
  documentNumber?: string | null;
};

export type ApiContact = {
  emailAddress?: string | null;
  mobilePhone?: string | null;
};

export type ApiUser = {
  id: number;
  username: string;
  person?: ApiPerson | null;
  contact?: ApiContact | null;
};
