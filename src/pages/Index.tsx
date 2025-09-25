import { AuthGuard } from '@/components/auth/AuthGuard';
import { PortfolioDashboard } from '@/components/portfolio/PortfolioDashboard';

const Index = () => {
  return (
    <AuthGuard>
      <PortfolioDashboard />
    </AuthGuard>
  );
};

export default Index;
