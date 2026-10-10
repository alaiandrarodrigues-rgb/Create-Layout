import { RouterProvider } from 'react-router';
import { router } from './routes';
import { InvoiceProvider } from './context/InvoiceContext';

export default function App() {
  return (
    <InvoiceProvider>
      <RouterProvider router={router} />
    </InvoiceProvider>
  );
}
