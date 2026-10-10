import { useNavigate } from 'react-router';
import { useInvoices } from '../context/InvoiceContext';
import { Button } from '../components/ui/button';
import { Plus, Clock, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function Dashboard() {
  const { invoices } = useInvoices();
  const navigate = useNavigate();

  const pendingInvoices = invoices.filter(inv => inv.status === 'pending');
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const totalToPay = [...pendingInvoices, ...overdueInvoices].reduce((sum, inv) => sum + inv.value, 0);

  const upcomingInvoices = [...pendingInvoices, ...overdueInvoices]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Vencida';
    if (diffDays === 0) return 'Vence hoje';
    if (diffDays === 1) return 'Vence amanhã';
    return `Vence em ${diffDays} dias`;
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  const stats = [
    { label: 'Pendentes', count: pendingInvoices.length, icon: Clock, color: '#F2C94C', bg: '#FFFBEB' },
    { label: 'Vencidas', count: overdueInvoices.length, icon: AlertCircle, color: '#EB5757', bg: '#FFF5F5' },
    { label: 'Pagas', count: paidInvoices.length, icon: CheckCircle2, color: '#27AE60', bg: '#F0FFF4' },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: '#F4F6FA' }}>

      {/* Header */}
      <div className="bg-white px-6 pt-6 pb-5 border-b border-gray-100">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#2D9CDB] uppercase mb-1">
              Bem-vinda
            </p>
            <h1 className="text-[1.6rem] font-bold text-gray-900 leading-tight">
              Olá, Alaiandra
            </h1>
          </div>
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2D9CDB] to-[#1a7fc1] flex items-center justify-center text-white text-base font-bold shadow-md">
            A
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 pt-6 space-y-5">

        {/* Hero card — total a pagar */}
        <div
          className="relative rounded-3xl p-7 overflow-hidden shadow-xl"
          style={{ background: 'linear-gradient(135deg, #2D9CDB 0%, #1a7fc1 60%, #155fa0 100%)' }}
        >
          {/* decorative circles */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10 bg-white" />
          <div className="absolute bottom-2 -right-4 w-24 h-24 rounded-full opacity-10 bg-white" />

          <p className="text-white/70 text-sm font-medium mb-2 tracking-wide">Total a pagar</p>
          <p className="text-white text-[2.8rem] font-extrabold leading-none tracking-tight">
            R$&nbsp;{formatCurrency(totalToPay)}
          </p>
          <p className="text-white/60 text-sm mt-3">
            {pendingInvoices.length + overdueInvoices.length} fatura{pendingInvoices.length + overdueInvoices.length !== 1 ? 's' : ''} em aberto
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map(({ label, count, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="rounded-2xl p-4 flex flex-col gap-2 shadow-sm"
              style={{ background: bg }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${color}22` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <p className="text-2xl font-bold text-gray-900 leading-none">{count}</p>
              <p className="text-xs font-medium text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Próximas faturas */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <h2 className="text-[1.05rem] font-bold text-gray-900">Próximas faturas</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/invoices')}
              className="text-[#2D9CDB] font-semibold -mr-2 text-sm"
            >
              Ver todas
            </Button>
          </div>

          {upcomingInvoices.length === 0 ? (
            <div className="px-6 pb-8 text-center text-gray-400 text-sm">
              Nenhuma fatura pendente
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {upcomingInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  onClick={() => navigate(`/invoices/${invoice.id}`)}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div
                    className="w-2 self-stretch rounded-full flex-shrink-0"
                    style={{ background: invoice.status === 'overdue' ? '#EB5757' : '#F2C94C' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-[0.95rem] truncate">{invoice.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{getDaysUntilDue(invoice.dueDate)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900 text-[0.95rem]">R$&nbsp;{formatCurrency(invoice.value)}</p>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={
                        invoice.status === 'overdue'
                          ? { background: '#EB575715', color: '#EB5757' }
                          : { background: '#F2C94C20', color: '#b8920a' }
                      }
                    >
                      {invoice.status === 'overdue' ? 'Vencida' : 'Pendente'}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </div>
              ))}
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
