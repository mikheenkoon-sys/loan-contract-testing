import axios from "axios";

export interface Loan {
  id: number;
  amount: number;
  currency: string;
  status: string;
}

export class LoanApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly token?: string) {}

  async getLoan(id: number): Promise<Loan | null>{
    try {
    const response = await axios.get<Loan>(
      `${this.baseUrl}/loans/${id}`,
      {
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : undefined
      }
    );
    return response.data;
  } catch (error: unknown) {

    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
  }
}