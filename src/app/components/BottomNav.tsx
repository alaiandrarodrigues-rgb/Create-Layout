import { useNavigate, useLocation } from "react-router";
import { Home, FileText, Settings } from "lucide-react";

const tabs = [
  { label: "Início",   icon: Home,     path: "/dashboard" },
  { label: "Faturas",  icon: FileText,  path: "/invoices" },
  { label: "Config.",  icon: Settings,  path: "/settings" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100"
      style={{ boxShadow: '0 -4px 24px rgba(0,0,0,0.06)' }}>
      <div className="flex max-w-lg mx-auto">
        {tabs.map(({ label, icon: Icon, path }) => {
          const active = pathname === path || (path === "/invoices" && pathname.startsWith("/invoices") && !pathname.includes('/new') && pathname !== '/invoices/new');
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex-1 flex flex-col items-center justify-center py-3.5 gap-1 relative transition-colors"
            >
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-10 rounded-full"
                  style={{ background: '#2D9CDB' }}
                />
              )}
              <Icon
                className="w-5 h-5 transition-colors"
                style={{ color: active ? '#2D9CDB' : '#9CA3AF' }}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span
                className="text-[11px] font-semibold transition-colors"
                style={{
                  color: active ? '#2D9CDB' : '#9CA3AF',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
