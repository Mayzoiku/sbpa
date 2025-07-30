import axios from "./axios";

const userId = 101;

class Wallet {
  async getWallets() {
    const response = await axios.get(`/wallets/${userId}`);
    return response.data;
  }

  async getTransactions() {
    const response = await axios.get(`/wallets/${userId}/transactions`);
    return response.data;
  }

  async getDashboardStats() {
    const response = await axios.get(`/wallets/${userId}/stats`);
    return response.data;
  }

  async getWallets() {
    const response = await axios.get(`/wallets/${userId}/`);
    return response.data;
  }

  async getSpendingInsights() {
    const response = await axios.get(`/wallets/${userId}/insights`);
    return response.data;
  }
}

const wallet = new Wallet();

export default wallet;
