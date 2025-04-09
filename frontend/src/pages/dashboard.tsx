import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import {
  fetchTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  Transaction,
} from '../features/transaction/transactionSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((state) => state.transactions);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const router = useRouter();

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch transactions when authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      dispatch(fetchTransactions(session.accessToken)); // Pass accessToken instead of user.id
    }
  }, [status, session?.accessToken, dispatch]);

  const handleAddOrUpdate = (tx: Omit<Transaction, 'id'> | Transaction) => {
    if (!session?.accessToken) {
      console.error("No access token available");
      return;
    }

    if ('id' in tx) {
      dispatch(updateTransaction({ 
        tx, 
        accessToken: session.accessToken 
      }));
      setEditing(null);
    } else {
      dispatch(addTransaction({ 
        tx, 
        accessToken: session.accessToken 
      }));
    }
  };

  const handleEdit = (tx: Transaction) => {
    setEditing(tx);
  };

  const handleDelete = (id: number) => {
    if (!session?.accessToken) {
      console.error("No access token available");
      return;
    }
    dispatch(deleteTransaction({ 
      id, 
      accessToken: session.accessToken 
    }));
  };

  if (status === "loading") return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Welcome, {session?.user?.name}</h1>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            Sign Out
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            {error}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Transactions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransactionForm 
            onSubmit={handleAddOrUpdate} 
            editing={editing}
          />
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading transactions...</p>
            </div>
          ) : (
            <TransactionList
              transactions={list}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
