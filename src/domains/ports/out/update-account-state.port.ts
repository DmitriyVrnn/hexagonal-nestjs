import { AccountEntity } from "../../entities/account.entity";

export interface UpdateAccountStatePort {
  updateActivities(accountId: AccountEntity)
}
