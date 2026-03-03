import { Container } from '@mui/material';
import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
}

export default function PageContainer({
  children,
}: PageContainerProps): React.ReactNode {
  return (
    <Container
      maxWidth="md"
      sx={{
        px: { xs: '20px', md: '40px' },
        py: { xs: '40px', md: '80px' },
      }}
    >
      {children}
    </Container>
  );
}
