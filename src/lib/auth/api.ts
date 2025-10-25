import { fetchFromApi } from "@/lib/api";

export type LoginResponse = {
  token: string;
  user: {
    id: number;
    username: string;
    accountType: string | null;
    roleId: number | null;
    personId: number | null;
    firstName: string | null;
    lastName: string | null;
    documentNumber: string | null;
    birthDate: string | null;
    nationalityId: number | null;
    birthCityId: number | null;
    emailAddress: string | null;
    mobilePhone: string | null;
    graduateType: "Civil" | "Militar" | null;
    militaryRankId: number | null;
  };
};

export async function loginWithCredentials(
  username: string,
  password: string
): Promise<LoginResponse> {
  return fetchFromApi("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password })
  });
}
