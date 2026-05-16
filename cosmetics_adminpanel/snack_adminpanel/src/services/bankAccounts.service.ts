import api from "../lib/api";

export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  instructions?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export const getBankAccounts = async (): Promise<BankAccount[]> => {
  const { data } = await api.get<{ bankAccounts: BankAccount[] }>(
    "/settings/bank-accounts"
  );
  return data.bankAccounts ?? [];
};

export const createBankAccount = async (
  payload: Partial<BankAccount>
): Promise<BankAccount> => {
  const { data } = await api.post<BankAccount>(
    "/settings/bank-accounts",
    payload
  );
  return data;
};

export const updateBankAccount = async (
  id: string,
  payload: Partial<BankAccount>
): Promise<BankAccount> => {
  const { data } = await api.put<BankAccount>(
    `/settings/bank-accounts/${id}`,
    payload
  );
  return data;
};

export const setBankAccountStatus = async (
  id: string,
  isActive: boolean
): Promise<BankAccount> => {
  const { data } = await api.patch<BankAccount>(
    `/settings/bank-accounts/${id}/status`,
    { isActive }
  );
  return data;
};

export const deleteBankAccount = async (id: string): Promise<void> => {
  await api.delete(`/settings/bank-accounts/${id}`);
};