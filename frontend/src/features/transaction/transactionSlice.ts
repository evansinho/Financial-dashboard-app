import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  source: 'manual' | 'bank';
  date: string;
}

interface State {
  list: Transaction[];
  loading: boolean;
  error: string | null;
  linkToken?: string;
}

const initialState: State = {
  list: [],
  loading: false,
  error: null,
  linkToken: undefined,
};

const API = `${process.env.NEXT_PUBLIC_API_URL}/api`;

// ───────────────────────────────────────────────────────────
// Async Thunks

export const fetchTransactions = createAsyncThunk(
  'transactions/fetch',
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/transactions/user`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return rejectWithValue("Failed to fetch transactions");
    }
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/add',
  async ({ tx, accessToken }: { tx: Omit<Transaction, 'id'>; accessToken: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/transactions`, tx, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding transaction:", error);
      return rejectWithValue("Failed to add transaction");
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/update',
  async ({ tx, accessToken }: { tx: Transaction; accessToken: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API}/transactions/${tx.id}`, tx, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating transaction:", error);
      return rejectWithValue("Failed to update transaction");
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/delete',
  async ({ id, accessToken }: { id: number; accessToken: string }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/transactions/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return id;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      return rejectWithValue("Failed to delete transaction");
    }
  }
);

export const fetchBankTransactions = createAsyncThunk(
  'transactions/fetchBank',
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/plaid/transactions`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching bank transactions:", error);
      return rejectWithValue("Failed to fetch bank transactions");
    }
  }
);

export const getPlaidAccessToken = createAsyncThunk(
  'transactions/getPlaidToken',
  async ({ publicToken, accessToken }: { publicToken: string; accessToken: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/plaid/token`, { publicToken }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching Plaid access token:", error);
      return rejectWithValue("Failed to fetch Plaid access token");
    }
  }
);

// Create Plaid Link Token
export const getPlaidLinkToken = createAsyncThunk(
  'transactions/getPlaidLinkToken',
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/plaid/link-token`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data; // { link_token: string }
    } catch (error) {
      console.error("Error getting link token:", error);
      return rejectWithValue("Failed to get link token");
    }
  }
);

// ───────────────────────────────────────────────────────────
// Slice

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      // Update
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.list.findIndex((tx) => tx.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.list = state.list.filter((tx) => tx.id !== action.payload);
      })

      // Bank Transactions
      .addCase(fetchBankTransactions.fulfilled, (state, action) => {
        state.list = [...action.payload, ...state.list];
      })

      // Plaid Token Exchange (Optional)
      .addCase(getPlaidAccessToken.fulfilled, () => {
        // Optional handling
      })

      // Handle Plaid Link Token
      .addCase(getPlaidLinkToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlaidLinkToken.fulfilled, (state, action) => {
        state.loading = false;
        state.linkToken = action.payload.link_token;
      })
      .addCase(getPlaidLinkToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default transactionSlice.reducer;
