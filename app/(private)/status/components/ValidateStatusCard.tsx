import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';
import { useHealthCheck } from '../hooks/useHealthCheck';
import Card from '@/app/components/Card';
import Button from '@/app/components/Button';
import { THEME_CONFIG } from '@/app/config/theme';

const ValidateStatusCard: React.FC = () => {
  const { status, checkHealth } = useHealthCheck();

  const headerCellStyle = {
    fontWeight: 'bold',
    backgroundColor: THEME_CONFIG.palette.line.main,
    color: THEME_CONFIG.palette.text.primary,
    width: '30%',
    borderRight: `1px solid ${THEME_CONFIG.palette.line.dark}`,
    borderBottom: `1px solid ${THEME_CONFIG.palette.line.dark}`,
  };

  const valueCellStyle = {
    backgroundColor: THEME_CONFIG.palette.line.light,
    color: THEME_CONFIG.palette.text.primary,
    wordBreak: 'break-word',
    whiteSpace: 'normal',
    borderBottom: `1px solid ${THEME_CONFIG.palette.line.dark}`,
  };

  const getStatusColor = (): string => {
    if (status.serverStatus === 'OK') return THEME_CONFIG.error.success;
    if (status.serverStatus === 'ERROR') return THEME_CONFIG.error.error;
    return THEME_CONFIG.palette.text.primary;
  };

  return (
    <Card data-testid="status-card">
      <Typography variant="h4" gutterBottom>
        Estado del Servidor
      </Typography>
      <Typography variant="body2" marginBottom={4}>
        Puedes verificar el estado del servidor dando click en el botón de
        abajo.
      </Typography>

      <Button
        onClick={checkHealth}
        disabled={status.status === 'loading'}
        data-testid="check-health-button"
        sx={{ marginBottom: 2 }}
      >
        Verificar
      </Button>

      <TableContainer
        component={Paper}
        sx={{
          mt: 3,
          boxShadow: 2,
          backgroundColor: THEME_CONFIG.palette.line.light,
          border: `1px solid ${THEME_CONFIG.palette.line.main}`,
        }}
        data-testid="status-table-container"
      >
        <Table
          size="small"
          sx={{ borderCollapse: 'separate', borderSpacing: 0 }}
          data-testid="status-table"
        >
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row" sx={headerCellStyle}>
                Status
              </TableCell>
              <TableCell
                sx={{
                  ...valueCellStyle,
                  color: getStatusColor(),
                  fontWeight: 'bold',
                }}
                data-testid="status-value"
              >
                {status.serverStatus || '-'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                component="th"
                scope="row"
                sx={{ ...headerCellStyle, borderBottom: 'none' }}
              >
                Timestamp
              </TableCell>
              <TableCell
                sx={{
                  ...valueCellStyle,
                  fontFamily: 'monospace',
                  borderBottom: 'none',
                }}
                data-testid="timestamp-value"
              >
                {status.timestamp
                  ? new Date(status.timestamp).toLocaleString()
                  : '-'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default ValidateStatusCard;
