import { Transaction } from '../features/transaction/transactionSlice';

interface Props {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: number) => void;
}

const TransactionList = ({ transactions, onEdit, onDelete }: Props) => {
  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <div key={tx.id} className="p-3 bg-gray-100 rounded shadow flex justify-between items-center">
          <div>
            <p className="font-medium">{tx.description}</p>
            <p className="text-sm text-gray-600">{tx.category} • {tx.date}</p>
            <p className="text-sm">{tx.type} • {tx.source}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onEdit(tx)} className="text-blue-500">Edit</button>
            <button onClick={() => onDelete(tx.id)} className="text-red-500">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
