import { Card, CardContent, CardHeader, Grid, Typography, Box, Divider, Skeleton } from '@mui/material';
import { Zap, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { ElectricalDataType } from '../../types';
import ValueDisplay from '../ui/ValueDisplay';
import GaugeChart from '../charts/GaugeChart';

interface ElectricalSectionProps {
  data: ElectricalDataType;
  loading: boolean;
  thresholds: {
    warning: { low: number, high: number },
    critical: { low: number, high: number }
  };
}

const ElectricalSection = ({ data, loading, thresholds }: ElectricalSectionProps) => {
  const getVoltageStatus = (value: number) => {
    if (value <= thresholds.critical.low || value >= thresholds.critical.high) return 'critical';
    if (value <= thresholds.warning.low || value >= thresholds.warning.high) return 'warning';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return '#ff5252';
      case 'warning': return '#ffb74d';
      default: return '#4caf50';
    }
  };

  const formatTime = (timeString: string) => {
    try {
      return format(new Date(timeString), 'HH:mm:ss dd/MM/yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Card 
      sx={{ 
        backgroundImage: 'linear-gradient(to bottom right, rgba(30, 30, 60, 0.4), rgba(30, 30, 60, 0.1))',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
      className="card"
    >
      <CardHeader 
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, rgba(255, 183, 77, 0.2), rgba(255, 193, 7, 0.2))',
                border: '1px solid rgba(255, 183, 77, 0.3)',
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Zap size={24} color="#ffb74d" />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Electrical Power Monitoring
            </Typography>
          </Box>
        } 
        sx={{ pb: 1 }}
      />
      <Divider sx={{ opacity: 0.1 }} />
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Phase Voltage Gauges - Made larger and better layout */}
          <Grid item xs={12} md={9}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ 
                mb: 2, 
                opacity: 0.9, 
                fontSize: '1.2rem',
                fontWeight: 600,
                color: 'text.primary'
              }}>
                Phase Voltage Monitoring
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" height={360} width="100%" sx={{ borderRadius: 2 }} />
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <GaugeChart
                      value={data.phase_r}
                      title="Phase R"
                      min={180}
                      max={260}
                      unit="V"
                      color={getStatusColor(getVoltageStatus(data.phase_r))}
                      thresholds={{
                        danger: [thresholds.critical.low, thresholds.critical.high],
                        warning: [thresholds.warning.low, thresholds.warning.high]
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <GaugeChart
                      value={data.phase_s}
                      title="Phase S"
                      min={180}
                      max={260}
                      unit="V"
                      color={getStatusColor(getVoltageStatus(data.phase_s))}
                      thresholds={{
                        danger: [thresholds.critical.low, thresholds.critical.high],
                        warning: [thresholds.warning.low, thresholds.warning.high]
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <GaugeChart
                      value={data.phase_t}
                      title="Phase T"
                      min={180}
                      max={260}
                      unit="V"
                      color={getStatusColor(getVoltageStatus(data.phase_t))}
                      thresholds={{
                        danger: [thresholds.critical.low, thresholds.critical.high],
                        warning: [thresholds.warning.low, thresholds.warning.high]
                      }}
                    />
                  </Grid>
                </Grid>
              )}
            </Box>
          </Grid>

          {/* Additional Electrical Parameters - Compact layout */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ 
              mb: 2, 
              opacity: 0.9, 
              fontSize: '1.2rem',
              fontWeight: 600,
              color: 'text.primary'
            }}>
              Power Metrics
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" height={360} width="100%" sx={{ borderRadius: 2 }} />
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ValueDisplay 
                    value={data.power_3ph.toFixed(1)}
                    unit="kW"
                    icon={<Activity size={20} />}
                    status="normal"
                    subtitle="Total Power"
                  />
                </Grid>
                <Grid item xs={12}>
                  <ValueDisplay 
                    value={data.frequency_3ph.toFixed(1)}
                    unit="Hz"
                    icon={<Activity size={20} />}
                    status="normal"
                    subtitle="Frequency"
                  />
                </Grid>
                <Grid item xs={12}>
                  <ValueDisplay 
                    value={data.pf_3ph.toFixed(2)}
                    icon={<Activity size={20} />}
                    status="normal"
                    subtitle="Power Factor"
                  />
                </Grid>
                <Grid item xs={12}>
                  <ValueDisplay 
                    value={data.energy_3ph.toFixed(1)}
                    unit="kWh"
                    icon={<Activity size={20} />}
                    status="normal"
                    subtitle="Energy"
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Enhanced information panel */}
        <Box 
          sx={{ 
            mt: 3, 
            p: 2.5, 
            borderRadius: 2, 
            background: 'linear-gradient(135deg, rgba(255, 183, 77, 0.1), rgba(255, 193, 7, 0.05))',
            border: '1px solid rgba(255, 183, 77, 0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography variant="subtitle2" sx={{ 
            display: 'block', 
            color: 'warning.light', 
            fontWeight: 600,
            mb: 1,
            fontSize: '1rem'
          }}>
            System Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="body2" sx={{ 
                display: 'block', 
                color: 'warning.light', 
                fontWeight: 500,
                opacity: 0.9
              }}>
                <strong>Voltage Thresholds:</strong> Warning: {thresholds.warning.low}V - {thresholds.warning.high}V, 
                Critical: {thresholds.critical.low}V - {thresholds.critical.high}V
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ 
                display: 'block', 
                color: 'warning.light', 
                fontWeight: 500,
                opacity: 0.9
              }}>
                <strong>Last Updated:</strong> {formatTime(data.waktu)}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ElectricalSection;