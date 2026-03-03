'use client';

import Navigation from './components/Navigation';
import AuthenticatedLayout from './components/AuthenticatedLayout';
import PageContainer from '@/app/components/PageContainer';

export default function AuthenticatedLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <AuthenticatedLayout>
      <Navigation />
      <PageContainer>{children}</PageContainer>
    </AuthenticatedLayout>
  );
}
