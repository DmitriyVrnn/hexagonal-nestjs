import { mock, when, anything, anyString, instance } from 'ts-mockito';
import { LoadAccountPort } from "../../ports/out/load-account.port";
import { UpdateAccountStatePort } from "../../ports/out/update-account-state.port";
import { AccountEntity, AccountId } from "../../entities/account.entity";
import { SendMoneyCommand } from "../../ports/in/send-money.command";
import { MoneyEntity } from "../../entities/money.entity";
import { SendMoneyService } from "../send-money.service";

describe('SendMoneyService', () => {
  it('should transaction success', function () {
    const loadAccountPort = mock<LoadAccountPort>();
    const updateAccountPort = mock<UpdateAccountStatePort>();

    function givenAccountWithDraw(id: AccountId) {
      const mockedAccountEntity = mock(AccountEntity);
      when(mockedAccountEntity.id).thenReturn(id);
      when(mockedAccountEntity.withdraw(anything(), anyString())).thenReturn(true);
      when(mockedAccountEntity.deposit(anything(), anyString())).thenReturn(true);
      const account = instance(mockedAccountEntity);
      when(loadAccountPort.loadAccount(id)).thenReturn(account);
      return account;
    }

    const sourceAccount = givenAccountWithDraw('41');
    const targetAccount = givenAccountWithDraw('42');

    const command = new SendMoneyCommand(
      sourceAccount.id,
      targetAccount.id,
      MoneyEntity.of(300)
    )

    const sendMoneyService = new SendMoneyService(instance(loadAccountPort), instance(updateAccountPort));
    const result = sendMoneyService.sendMoney(command);

    expect(result).toBeTruthy();
  });
})
