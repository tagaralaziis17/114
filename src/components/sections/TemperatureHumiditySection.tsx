import { Card, CardContent, CardHeader, Grid, Typography, Box, Divider, Skeleton, Paper } from '@mui/material';
import { Thermometer, Droplets, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { DataType } from '../../types';

interface TemperatureHumiditySectionProps {
  data: DataType;
  loading: boolean;
  thresholds: {
    temperature: {
      warning: { low: number; high: number };
      critical: { low: number; high: number };
    };
    humidity: {
      warning: { low: number; high: number };
      critical: { low: number; high: number };
    };
  };
}

const TemperatureHumiditySection = ({ 
  data, 
  loading,
  thresholds
}: TemperatureHumiditySectionProps) => {
  
  const getTemperatureStatus = (value: number) => {
    if (value >= thresholds.temperature.critical.high || value <= thresholds.temperature.critical.low) return 'critical';
    if (value >= thresholds.temperature.warning.high || value <= thresholds.temperature.warning.low) return 'warning';
    return 'normal';
  };

  const getHumidityStatus = (value: number) => {
    if (value >= thresholds.humidity.critical.high || value <= thresholds.humidity.critical.low) return 'critical';
    if (value >= thresholds.humidity.warning.high || value <= thresholds.humidity.warning.low) return 'warning';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return '#ff5252';
      case 'warning': return '#ffb74d';
      default: return '#4caf50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'critical': return 'CRITICAL';
      case 'warning': return 'WARNING';
      default: return 'NORMAL';
    }
  };

  const formatTime = (timeString: string) => {
    try {
      return format(new Date(timeString), 'HH:mm:ss dd/MM/yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const ElegantValueDisplay = ({ 
    value, 
    unit, 
    status, 
    icon, 
    label, 
    timestamp,
    gradient 
  }: {
    value: number;
    unit: string;
    status: string;
    icon: React.ReactNode;
    label: string;
    timestamp: string;
    gradient: string;
  }) => {
    const statusColor = getStatusColor(status);
    const statusLabel = getStatusLabel(status);

    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          background: gradient,
          border: `1px solid ${statusColor}30`,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 12px 40px ${statusColor}20`,
            border: `1px solid ${statusColor}50`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${statusColor}, ${statusColor}80)`,
            borderRadius: '3px 3px 0 0',
          }
        }}
      >
        {/* Header with icon and label */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box 
            sx={{ 
              p: 1.5,
              borderRadius: 2,
              background: `${statusColor}20`,
              border: `1px solid ${statusColor}30`,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 0.5
              }}
            >
              {label}
            </Typography>
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                background: `${statusColor}15`,
                border: `1px solid ${statusColor}30`,
                display: 'inline-block'
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  color: statusColor,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}
              >
                {statusLabel}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main value display */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography 
            variant="h2" 
            component="div"
            sx={{ 
              fontWeight: 700,
              background: `linear-gradient(135deg, ${statusColor}, ${statusColor}80)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
              mb: 0.5,
              textShadow: `0 0 20px ${statusColor}40`,
            }}
          >
            {value.toFixed(1)}
            <Typography 
              component="span" 
              sx={{ 
                fontSize: '1.5rem', 
                verticalAlign: 'top',
                ml: 0.5,
                color: statusColor,
                opacity: 0.8
              }}
            >
              {unit}
            </Typography>
          </Typography>
        </Box>

        {/* Timestamp */}
        <Box 
          sx={{ 
            textAlign: 'center',
            pt: 2,
            borderTop: `1px solid ${statusColor}20`
          }}
        >
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              fontWeight: 500,
              opacity: 0.8
            }}
          >
            {timestamp}
          </Typography>
        </Box>

        {/* Animated background effect */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 50% 50%, ${statusColor}05, transparent 70%)`,
            animation: status !== 'normal' ? 'pulse 3s ease-in-out infinite' : 'none',
            pointerEvents: 'none',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.3 },
              '50%': { opacity: 0.6 },
            }
          }}
        />
      </Paper>
    );
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
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
                background: 'linear-gradient(135deg, rgba(0, 176, 255, 0.2), rgba(63, 136, 242, 0.2))',
                border: '1px solid rgba(0, 176, 255, 0.3)',
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Thermometer size={24} color="#00b0ff" />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Temperature & Humidity Monitoring
            </Typography>
          </Box>
        } 
        sx={{ pb: 1 }}
      />
      <Divider sx={{ opacity: 0.1 }} />
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* NOC Temperature */}
          <Grid item xs={12} sm={6}>
            {loading ? (
              <Skeleton variant="rectangular\" height={200} sx={{ borderRadius: 3 }} />
            ) : (
              <ElegantValueDisplay 
                value={data.nocTemperature.suhu}
                unit="°C"
                status={getTemperatureStatus(data.nocTemperature.suhu)}
                icon={<Thermometer size={24} color="#3f88f2" />}
                label="NOC Temperature"
                timestamp={formatTime(data.nocTemperature.waktu)}
                gradient="linear-gradient(135deg, rgba(63, 136, 242, 0.1), rgba(0, 176, 255, 0.05))"
              />
            )}
          </Grid>

          {/* UPS Temperature */}
          <Grid item xs={12} sm={6}>
            {loading ? (
              <Skeleton variant="rectangular\" height={200} sx={{ borderRadius: 3 }} />
            ) : (
              <ElegantValueDisplay 
                value={data.upsTemperature.suhu}
                unit="°C"
                status={getTemperatureStatus(data.upsTemperature.suhu)}
                icon={<Thermometer size={24} color="#00b0ff" />}
                label="UPS Temperature"
                timestamp={formatTime(data.upsTemperature.waktu)}
                gradient="linear-gradient(135deg, rgba(0, 176, 255, 0.1), rgba(63, 136, 242, 0.05))"
              />
            )}
          </Grid>

          {/* NOC Humidity */}
          <Grid item xs={12} sm={6}>
            {loading ? (
              <Skeleton variant="rectangular\" height={200} sx={{ borderRadius: 3 }} />
            ) : (
              <ElegantValueDisplay 
                value={data.nocHumidity.kelembapan}
                unit="%"
                status={getHumidityStatus(data.nocHumidity.kelembapan)}
                icon={<Droplets size={24} color="#29b6f6" />}
                label="NOC Humidity"
                timestamp={formatTime(data.nocHumidity.waktu)}
                gradient="linear-gradient(135deg, rgba(41, 182, 246, 0.1), rgba(100, 181, 246, 0.05))"
              />
            )}
          </Grid>

          {/* UPS Humidity */}
          <Grid item xs={12} sm={6}>
            {loading ? (
              <Skeleton variant="rectangular\" height={200} sx={{ borderRadius: 3 }} />
            ) : (
              <ElegantValueDisplay 
                value={data.upsHumidity.kelembapan}
                unit="%"
                status={getHumidityStatus(data.upsHumidity.kelembapan)}
                icon={<Droplets size={24} color="#64b5f6" />}
                label="UPS Humidity"
                timestamp={formatTime(data.upsHumidity.waktu)}
                gradient="linear-gradient(135deg, rgba(100, 181, 246, 0.1), rgba(41, 182, 246, 0.05))"
              />
            )}
          </Grid>
        </Grid>

        {/* Enhanced threshold information */}
        <Box 
          sx={{ 
            mt: 3, 
            p: 2.5, 
            borderRadius: 2, 
            background: 'linear-gradient(135deg, rgba(0, 176, 255, 0.1), rgba(63, 136, 242, 0.05))',
            border: '1px solid rgba(0, 176, 255, 0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography variant="subtitle2" sx={{ 
            display: 'block', 
            color: 'info.light', 
            fontWeight: 600,
            mb: 1,
            fontSize: '1rem'
          }}>
            Monitoring Thresholds
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ 
                display: 'block', 
                color: 'info.light', 
                fontWeight: 500,
                opacity: 0.9
              }}>
                <strong>Temperature:</strong> Warning: {thresholds.temperature.warning.low}°C - {thresholds.temperature.warning.high}°C, 
                Critical: {thresholds.temperature.critical.low}°C - {thresholds.temperature.critical.high}°C
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ 
                display: 'block', 
                color: 'info.light', 
                fontWeight: 500,
                opacity: 0.9
              }}>
                <strong>Humidity:</strong> Warning: {thresholds.humidity.warning.low}% - {thresholds.humidity.warning.high}%, 
                Critical: {thresholds.humidity.critical.low}% - {thresholds.humidity.critical.high}%
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TemperatureHumiditySection;