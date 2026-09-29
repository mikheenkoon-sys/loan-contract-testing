export interface ProviderLoan {
  id: number;
  amount: number;
  currency: string;
  status: string;
  customerId: number;
  internalRiskScore: number;
}

export class LoanRepository {
  private readonly loans = new Map<number, ProviderLoan>();

  findById(id: number): ProviderLoan | undefined {
    return this.loans.get(id);
  }

  save(loan: ProviderLoan): void {
    this.loans.set(loan.id, loan);
  }

  clear(): void {
    this.loans.clear();
  }
}