import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useInvoices } from '../context/InvoiceContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export default function InvoiceForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  const { addInvoice, updateInvoice, getInvoiceById } = useInvoices();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    value: '',
    dueDate: '',
    category: '',
  });

  useEffect(() => {
    if (isEditMode) {
      const invoice = getInvoiceById(id);
      if (invoice) {
        setFormData({
          name: invoice.name,
          value: invoice.value.toString(),
          dueDate: invoice.dueDate,
          category: invoice.category || '',
        });
      }
    }
  }, [id, isEditMode, getInvoiceById]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const invoiceData = {
      name: formData.name,
      value: parseFloat(formData.value),
      dueDate: formData.dueDate,
      category: formData.category || undefined,
      status: 'pending' as const,
    };

    if (isEditMode) {
      updateInvoice(id, invoiceData);
    } else {
      addInvoice(invoiceData);
    }

    navigate('/invoices');
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
              onClick={() => navigate(-1)}
              className="rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl">
              {isEditMode ? 'Editar Fatura' : 'Nova Fatura'}
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <Card className="p-8 rounded-2xl shadow-sm bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome da fatura</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ex: Netflix, Luz, Água..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-12 rounded-xl text-base"
              />
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <Label htmlFor="value">Valor</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  R$
                </span>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  required
                  className="h-12 rounded-xl pl-12 text-base"
                />
              </div>
            </div>

            {/* Data de Vencimento */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">Data de vencimento</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
                className="h-12 rounded-xl text-base"
              />
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoria (opcional)</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="h-12 rounded-xl text-base">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Moradia">Moradia</SelectItem>
                  <SelectItem value="Utilidades">Utilidades</SelectItem>
                  <SelectItem value="Entretenimento">Entretenimento</SelectItem>
                  <SelectItem value="Saúde">Saúde</SelectItem>
                  <SelectItem value="Educação">Educação</SelectItem>
                  <SelectItem value="Transporte">Transporte</SelectItem>
                  <SelectItem value="Alimentação">Alimentação</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botão Salvar */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#2D9CDB] hover:bg-[#2D9CDB]/90 text-base"
            >
              {isEditMode ? 'Salvar alterações' : 'Salvar fatura'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
