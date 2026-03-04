'use client';

import { useSearchParams } from 'next/navigation';
import Navigation from './components/Navigation';
import AuthenticatedLayout from './components/AuthenticatedLayout';
import PageContainer from '@/app/components/PageContainer';

export default function AuthenticatedLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const searchParams = useSearchParams();
  const hideNavigation = searchParams.get('nav') === 'false';

  return (
    <AuthenticatedLayout>
      {!hideNavigation && <Navigation />}
      <PageContainer>{children}</PageContainer>
    </AuthenticatedLayout>
  );
}
