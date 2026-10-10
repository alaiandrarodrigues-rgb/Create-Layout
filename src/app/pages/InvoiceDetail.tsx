import { useNavigate, useParams } from 'react-router';
import { useInvoices, InvoiceStatus } from '../context/InvoiceContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Check, Edit2, Trash2, AlertCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

export default function InvoiceDetail() {
  const { id } = useParams();
  const { getInvoiceById, updateInvoice, deleteInvoice } = useInvoices();
  const navigate = useNavigate();

  const invoice = getInvoiceById(id || '');

  if (!invoice) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Card className="p-8 rounded-2xl">
          <p className="text-gray-500">Fatura não encontrada</p>
          <Button onClick={() => navigate('/invoices')} className="mt-4">
            Voltar para lista
          </Button>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getStatusLabel = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'overdue': return 'Vencido';
    }
  };

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid': return 'bg-[#27AE60]/20 text-[#27AE60]';
      case 'pending': return 'bg-[#F2C94C]/20 text-[#F2C94C]';
      case 'overdue': return 'bg-[#EB5757]/20 text-[#EB5757]';
    }
  };

  const handleMarkAsPaid = () => {
    updateInvoice(invoice.id, { status: 'paid' });
  };

  const handleDelete = () => {
    deleteInvoice(invoice.id);
    navigate('/invoices');
  };

  const handleEdit = () => {
    navigate(`/invoices/${invoice.id}/edit`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/invoices')}
              className="rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl">Detalhes da Fatura</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Alerta se vencida */}
        {invoice.status === 'overdue' && (
          <Card className="bg-[#EB5757]/10 border-[#EB5757]/30 p-4 rounded-2xl mb-6">
            <div className="flex items-center gap-3 text-[#EB5757]">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">Esta fatura está vencida!</p>
            </div>
          </Card>
        )}

        {/* Card Principal */}
        <Card className="p-8 rounded-2xl shadow-sm bg-white mb-6">
          <div className="space-y-6">
            {/* Nome */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Nome da conta</p>
              <p className="text-2xl">{invoice.name}</p>
            </div>

            {/* Valor */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Valor</p>
              <p className="text-3xl text-[#2D9CDB]">
                R$ {invoice.value.toFixed(2).replace('.', ',')}
              </p>
            </div>

            {/* Data de vencimento */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Data de vencimento</p>
              <p className="text-xl">{formatDate(invoice.dueDate)}</p>
            </div>

            {/* Categoria */}
            {invoice.category && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Categoria</p>
                <p className="text-lg">{invoice.category}</p>
              </div>
            )}

            {/* Status */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Status</p>
              <span className={`inline-block px-4 py-2 rounded-full ${getStatusColor(invoice.status)}`}>
                {getStatusLabel(invoice.status)}
              </span>
            </div>
          </div>
        </Card>

        {/* Botões de Ação */}
        <div className="space-y-3">
          {invoice.status !== 'paid' && (
            <Button
              onClick={handleMarkAsPaid}
              className="w-full h-12 rounded-xl bg-[#27AE60] hover:bg-[#27AE60]/90"
            >
              <Check className="w-5 h-5 mr-2" />
              Marcar como paga
            </Button>
          )}

          <Button
            onClick={handleEdit}
            variant="outline"
            className="w-full h-12 rounded-xl"
          >
            <Edit2 className="w-5 h-5 mr-2" />
            Editar
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl text-[#EB5757] border-[#EB5757]/30 hover:bg-[#EB5757]/10"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir fatura?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. A fatura "{invoice.name}" será excluída permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-[#EB5757] hover:bg-[#EB5757]/90"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
