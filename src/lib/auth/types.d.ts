export type AccountStatus = "ACTIVE" | "BLOCKED";

export type DemoUser = {
  userId: string;
  personId: string;
  controlLevelId: string;
  fullName: string;
  recordNumber: string;
  username: string;
  accountStatus: AccountStatus;
  password: string;
};
