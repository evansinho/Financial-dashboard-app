import { useState, useEffect } from 'react';
import { Transaction } from '../features/transaction/transactionSlice';

interface Props {
  onSubmit: (tx: Omit<Transaction, 'id'> | Transaction) => void;
  editing?: Transaction | null;
}

const TransactionForm = ({ onSubmit, editing }: Props) => {
  const [form, setForm] = useState<Omit<Transaction, 'id'>>({
    amount: 0,
    date: '',
    description: '',
    category: '',
    type: 'expense',
    source: 'manual',
  });

  useEffect(() => {
    if (editing) {
      const { ...rest } = editing;
      setForm(rest);
    }
  }, [editing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ amount: 0, date: '', description: '', category: '', type: 'expense', source: 'manual' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" required />
      <input type="date" name="date" value={form.date} onChange={handleChange} required />
      <input type="text" name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
      <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="Category" required />
      <select name="type" value={form.type} onChange={handleChange}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <select name="source" value={form.source} onChange={handleChange}>
        <option value="manual">Manual</option>
        <option value="bank">Bank</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {editing ? 'Update' : 'Add'} Transaction
      </button>
    </form>
  );
};

export default TransactionForm;
