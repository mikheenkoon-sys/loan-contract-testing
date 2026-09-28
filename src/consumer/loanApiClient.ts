import axios from "axios";

export interface Loan {
  id: number;
  amount: number;
  currency: string;
  status: string;
}

export class LoanApiClient {
  constructor(private readonly baseUrl: string) {}

  async getLoan(id: number): Promise<Loan> {
    const response = await axios.get<Loan>(`${this.baseUrl}/loans/${id}`);
    return response.data;
  }
}