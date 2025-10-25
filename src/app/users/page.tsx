import Link from "next/link";
import { getUsers } from "@/lib/api";
import type { ApiUser } from "@/types/user";

function isApiUser(value: unknown): value is ApiUser {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === "number" && typeof obj.username === "string"
  );
}

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  let users: ApiUser[] = [];
  let errorMessage: string | null = null;

  try {
    const data = await getUsers();
    users = Array.isArray(data) ? data.filter(isApiUser) : [];
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Unable to load users from the API.";
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Users</h1>
          <p className="text-sm text-slate-600">
            Data served by the Secretaria General API.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Back to dashboard
        </Link>
      </header>

      {errorMessage ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {errorMessage}
        </div>
      ) : (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                  Username
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                  Full name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                  Document
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                  Mobile
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {users.map((user) => {
                const fullName = user.person
                  ? `${user.person.firstName ?? ""} ${user.person.lastName ?? ""}`.trim()
                  : "-";

                return (
                  <tr key={user.id}>
                    <td className="px-4 py-3 text-sm text-slate-700">{user.username}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{fullName || "-"}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {user.person?.documentNumber ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {user.contact?.emailAddress ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {user.contact?.mobilePhone ?? "-"}
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
