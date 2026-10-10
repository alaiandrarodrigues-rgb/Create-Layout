import { useNavigate } from 'react-router';
import { useInvoices } from '../context/InvoiceContext';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Bell, Info, LogOut } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function Settings() {
  const { reminderSettings, updateReminderSettings } = useInvoices();
  const navigate = useNavigate();

  const toggleReminders = () =>
    updateReminderSettings({ ...reminderSettings, enabled: !reminderSettings.enabled });

  const toggleDay = (day: number) => {
    const newDays = reminderSettings.days.includes(day)
      ? reminderSettings.days.filter(d => d !== day)
      : [...reminderSettings.days, day].sort((a, b) => a - b);
    updateReminderSettings({ ...reminderSettings, days: newDays });
  };

  const dayOptions = [
    { day: 1, label: '1 dia antes' },
    { day: 3, label: '3 dias antes' },
    { day: 7, label: '7 dias antes' },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: '#F4F6FA' }}>

      {/* Header */}
      <div className="bg-white px-6 pt-6 pb-5 border-b border-gray-100">
        <div className="max-w-lg mx-auto">
          <h1 className="text-[1.6rem] font-bold text-gray-900">Configurações</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 pt-6 space-y-4">

        {/* Lembretes */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 pt-6 pb-5 border-b border-gray-50">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#EBF6FD' }}>
              <Bell className="w-5 h-5 text-[#2D9CDB]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Lembretes</h2>
              <p className="text-xs text-gray-400">Notificações de vencimento</p>
            </div>
          </div>

          {/* Toggle principal */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <div>
              <p className="text-[0.95rem] font-semibold text-gray-800">Ativar lembretes</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Receba avisos antes do vencimento
              </p>
            </div>
            <Switch
              checked={reminderSettings.enabled}
              onCheckedChange={toggleReminders}
            />
          </div>

          {/* Opções de dias */}
          {reminderSettings.enabled && (
            <div className="px-6 py-4 space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Quando avisar
              </p>
              {dayOptions.map(({ day, label }) => (
                <div key={day} className="flex items-center justify-between py-3">
                  <p className="text-[0.95rem] font-medium text-gray-800">{label}</p>
                  <Switch
                    checked={reminderSettings.days.includes(day)}
                    onCheckedChange={() => toggleDay(day)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sobre */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 pt-6 pb-5 border-b border-gray-50">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#F0F2F5' }}>
              <Info className="w-5 h-5 text-gray-500" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Sobre</h2>
          </div>
          <div className="px-6 py-4 space-y-3">
            {[['Versão', '1.0.0'], ['Desenvolvido por', 'ContaFácil Team']].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center py-1">
                <span className="text-[0.9rem] text-gray-500">{k}</span>
                <span className="text-[0.9rem] font-semibold text-gray-800">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sair */}
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="w-full h-13 rounded-2xl text-[0.95rem] font-semibold border-gray-200 text-gray-600 flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sair da conta
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
