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
            <Zap size={24} color="#ffb74d" />
            <Typography variant="h5" sx={{ ml: 1, fontWeight: 600 }}>
              Electrical Monitoring
            </Typography>
          </Box>
        } 
        sx={{ pb: 1 }}
      />
      <Divider sx={{ opacity: 0.1 }} />
      <CardContent>
        <Grid container spacing={3}>
          {/* Phase Voltage Gauges - Made larger */}
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, opacity: 0.7, fontSize: '1.1rem' }}>
                Phase Voltage Monitoring
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" height={320} width="100%" />
              ) : (
                <Grid container spacing={2} sx={{ mt: 1 }}>
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

          {/* Additional Electrical Parameters */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ mb: 2, opacity: 0.7, fontSize: '1.1rem' }}>
              Power Monitoring
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" height={320} width="100%" />
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

        <Box 
          sx={{ 
            mt: 3, 
            p: 2, 
            borderRadius: 2, 
            bgcolor: 'rgba(255, 183, 77, 0.1)', 
            border: '1px solid rgba(255, 183, 77, 0.2)' 
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ display: 'block', color: 'warning.light', fontWeight: 500 }}>
                <strong>Voltage Thresholds:</strong> Warning: {thresholds.warning.low}V - {thresholds.warning.high}V, 
                Critical: {thresholds.critical.low}V - {thresholds.critical.high}V
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Typography variant="body2" sx={{ display: 'block', color: 'warning.light', fontWeight: 500 }}>
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