import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useInvoices, InvoiceStatus } from '../context/InvoiceContext';
import { Plus } from 'lucide-react';
import BottomNav from '../components/BottomNav';

type Filter = InvoiceStatus | 'all';

const filters: { key: Filter; label: string; color: string; active: string }[] = [
  { key: 'all',     label: 'Todas',     color: '#6B7280', active: '#2D9CDB' },
  { key: 'pending', label: 'Pendentes', color: '#b8920a', active: '#F2C94C' },
  { key: 'paid',    label: 'Pagas',     color: '#27AE60', active: '#27AE60' },
  { key: 'overdue', label: 'Vencidas',  color: '#EB5757', active: '#EB5757' },
];

const statusConfig = {
  paid:    { label: 'Pago',      bg: '#F0FFF4', text: '#27AE60', dot: '#27AE60' },
  pending: { label: 'Pendente',  bg: '#FFFBEB', text: '#b8920a', dot: '#F2C94C' },
  overdue: { label: 'Vencido',   bg: '#FFF5F5', text: '#EB5757', dot: '#EB5757' },
};

export default function InvoiceList() {
  const { invoices } = useInvoices();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');

  const sorted = [...invoices]
    .filter(inv => filter === 'all' || inv.status === filter)
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

  const formatCurrency = (v: number) =>
    v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  return (
    <div className="min-h-screen pb-24" style={{ background: '#F4F6FA' }}>

      {/* Header */}
      <div className="bg-white px-6 pt-6 pb-0 border-b border-gray-100">
        <div className="max-w-lg mx-auto">
          <h1 className="text-[1.6rem] font-bold text-gray-900 mb-5">Minhas Faturas</h1>

          {/* Filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {filters.map(({ key, label, active }) => {
              const isActive = filter === key;
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                  style={
                    isActive
                      ? { background: active, color: key === 'pending' ? '#7a5f00' : '#fff' }
                      : { background: '#F0F2F5', color: '#6B7280' }
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="max-w-lg mx-auto px-5 pt-5">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          {sorted.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <p className="text-base">Nenhuma fatura encontrada</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {sorted.map((invoice) => {
                const cfg = statusConfig[invoice.status];
                return (
                  <div
                    key={invoice.id}
                    onClick={() => navigate(`/invoices/${invoice.id}`)}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: cfg.dot }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-[0.95rem] truncate">{invoice.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(invoice.dueDate)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-900 text-[0.95rem] mb-1">
                        R$&nbsp;{formatCurrency(invoice.value)}
                      </p>
                      <span
                        className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ background: cfg.bg, color: cfg.text }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/invoices/new')}
        className="fixed bottom-24 right-5 w-14 h-14 bg-[#2D9CDB] text-white rounded-full shadow-xl hover:bg-[#1a7fc1] active:scale-95 transition-all flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </button>

      <BottomNav />
    </div>
  );
}
