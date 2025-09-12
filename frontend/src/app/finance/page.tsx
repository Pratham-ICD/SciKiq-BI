import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { FinanceDashboard } from '@/components/finance/FinanceDashboard';

export default function FinancePage() {
  return (
    <SidebarLayout>
      <FinanceDashboard />
    </SidebarLayout>
  );
}
