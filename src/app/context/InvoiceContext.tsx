import React, { createContext, useContext, useState, ReactNode } from 'react';

export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface Invoice {
  id: string;
  name: string;
  value: number;
  dueDate: string;
  status: InvoiceStatus;
  category?: string;
}

export interface ReminderSettings {
  enabled: boolean;
  days: number[];
}

interface InvoiceContextType {
  invoices: Invoice[];
  reminderSettings: ReminderSettings;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  updateReminderSettings: (settings: ReminderSettings) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within InvoiceProvider');
  }
  return context;
};

// Mock data inicial
const initialInvoices: Invoice[] = [
  {
    id: '1',
    name: 'Netflix',
    value: 39.90,
    dueDate: '2026-03-21',
    status: 'pending',
    category: 'Entretenimento'
  },
  {
    id: '2',
    name: 'Luz',
    value: 120.00,
    dueDate: '2026-03-23',
    status: 'pending',
    category: 'Utilidades'
  },
  {
    id: '3',
    name: 'Internet',
    value: 99.90,
    dueDate: '2026-03-15',
    status: 'overdue',
    category: 'Utilidades'
  },
  {
    id: '4',
    name: 'Água',
    value: 65.00,
    dueDate: '2026-03-10',
    status: 'overdue',
    category: 'Utilidades'
  },
  {
    id: '5',
    name: 'Spotify',
    value: 21.90,
    dueDate: '2026-03-05',
    status: 'paid',
    category: 'Entretenimento'
  },
  {
    id: '6',
    name: 'Aluguel',
    value: 800.00,
    dueDate: '2026-03-01',
    status: 'paid',
    category: 'Moradia'
  },
  {
    id: '7',
    name: 'Academia',
    value: 89.90,
    dueDate: '2026-03-12',
    status: 'paid',
    category: 'Saúde'
  },
];

export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>({
    enabled: true,
    days: [1, 3, 7]
  });

  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: Date.now().toString(),
    };
    setInvoices([...invoices, newInvoice]);
  };

  const updateInvoice = (id: string, updatedFields: Partial<Invoice>) => {
    setInvoices(invoices.map(inv => 
      inv.id === id ? { ...inv, ...updatedFields } : inv
    ));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
  };

  const updateReminderSettings = (settings: ReminderSettings) => {
    setReminderSettings(settings);
  };

  const getInvoiceById = (id: string) => {
    return invoices.find(inv => inv.id === id);
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        reminderSettings,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        updateReminderSettings,
        getInvoiceById,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
