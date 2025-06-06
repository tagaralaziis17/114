import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceArea
} from 'recharts';
import { Typography, Box } from '@mui/material';
import { format, parseISO } from 'date-fns';

interface DataPoint {
  timestamp: string;
  phase_r: number;
  phase_s: number;
  phase_t: number;
}

interface ElectricalChartProps {
  data: DataPoint[];
  timeRange: string;
  zoomLevel?: number;
}

const ElectricalChart = ({ data, timeRange, zoomLevel = 1 }: ElectricalChartProps) => {
  // Format x-axis ticks based on time range
  const formatXAxis = (tickItem: string) => {
    try {
      const date = parseISO(tickItem);
      switch(timeRange) {
        case 'realtime':
          return format(date, 'HH:mm:ss'); // Show seconds for realtime (1 minute)
        case '1h':
          return format(date, 'HH:mm'); // Show minutes for 1 hour
        case '24h':
          return format(date, 'HH:mm'); // Show hours:minutes for 24h
        case '7d':
          return format(date, 'dd/MM HH:mm'); // Show day/month and time for 7 days
        case '30d':
          return format(date, 'dd/MM'); // Show day/month for 30 days
        default:
          return format(date, 'HH:mm');
      }
    } catch (error) {
      return '';
    }
  };

  // Calculate optimal tick interval based on time range and data length
  const getTickInterval = () => {
    const dataLength = data.length;
    if (dataLength === 0) return 0;
    
    switch(timeRange) {
      case 'realtime':
        return Math.max(1, Math.floor(dataLength / 6)); // Show ~6 ticks for 1 minute (every 10 seconds)
      case '1h':
        return Math.max(1, Math.floor(dataLength / 12)); // Show ~12 ticks for 1 hour (every 5 minutes)
      case '24h':
        return Math.max(1, Math.floor(dataLength / 12)); // Show ~12 ticks for 24h
      case '7d':
        return Math.max(1, Math.floor(dataLength / 14)); // Show ~14 ticks for 7 days
      case '30d':
        return Math.max(1, Math.floor(dataLength / 15)); // Show ~15 ticks for 30 days
      default:
        return Math.max(1, Math.floor(dataLength / 10));
    }
  };

  // Get optimal stroke width based on zoom level
  const getStrokeWidth = () => {
    if (zoomLevel >= 4) return 3;
    if (zoomLevel >= 2) return 2.5;
    return 2;
  };

  // Get dot size based on zoom level and time range
  const getDotSize = () => {
    if (timeRange === 'realtime') {
      return 4; // Always show dots for realtime (1 minute data)
    }
    if (timeRange === '1h') {
      return zoomLevel >= 2 ? 4 : 3; // Show dots for 1 hour data
    }
    if (zoomLevel >= 4) return 4;
    if (zoomLevel >= 3) return 3;
    return false;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      try {
        const date = parseISO(label);
        let formattedDate;
        
        switch(timeRange) {
          case 'realtime':
            formattedDate = format(date, 'HH:mm:ss'); // Show exact time for 1 minute
            break;
          case '1h':
            formattedDate = format(date, 'HH:mm'); // Show time for 1 hour
            break;
          case '24h':
            formattedDate = format(date, 'dd MMM HH:mm');
            break;
          case '7d':
            formattedDate = format(date, 'dd MMM yyyy HH:mm');
            break;
          case '30d':
            formattedDate = format(date, 'dd MMM yyyy');
            break;
          default:
            formattedDate = format(date, 'dd MMM yyyy HH:mm');
        }
        
        return (
          <Box 
            sx={{ 
              bgcolor: 'background.paper', 
              p: 1.5, 
              borderRadius: 1,
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              {formattedDate}
            </Typography>
            {payload.map((entry: any, index: number) => (
              <Typography 
                key={`tooltip-${index}`} 
                variant="body2"
                sx={{ 
                  color: entry.color,
                  display: 'flex',
                  alignItems: 'center',
                  my: 0.5
                }}
              >
                <Box 
                  component="span" 
                  sx={{ 
                    width: 10, 
                    height: 10, 
                    bgcolor: entry.color, 
                    borderRadius: '50%',
                    display: 'inline-block',
                    mr: 1,
                    boxShadow: `0 0 4px ${entry.color}`
                  }} 
                />
                {entry.name}: {entry.value?.toFixed(1)}V
              </Typography>
            ))}
          </Box>
        );
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  // Get angle for x-axis labels based on time range
  const getXAxisAngle = () => {
    switch(timeRange) {
      case 'realtime':
        return -30; // Angle for realtime to show seconds clearly
      case '1h':
        return 0; // Horizontal for 1 hour
      case '24h':
        return -30; // Slight angle for medium range
      case '7d':
      case '30d':
        return -45; // More angle for long ranges
      default:
        return 0;
    }
  };

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ 
            top: 5, 
            right: 30, 
            left: 20, 
            bottom: getXAxisAngle() !== 0 ? 60 : 30 
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            opacity={0.15}
            stroke="rgba(255, 255, 255, 0.1)"
          />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatXAxis} 
            stroke="#aaa"
            tick={{ 
              fill: '#aaa', 
              fontSize: timeRange === 'realtime' ? 10 : 12,
              fontWeight: 500
            }}
            interval={getTickInterval()}
            angle={getXAxisAngle()}
            textAnchor={getXAxisAngle() !== 0 ? 'end' : 'middle'}
            height={getXAxisAngle() !== 0 ? 60 : 30}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
            tickLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
          />
          <YAxis 
            stroke="#aaa"
            tick={{ 
              fill: '#aaa', 
              fontSize: 12,
              fontWeight: 500
            }}
            domain={[180, 260]}
            label={{ 
              value: 'Voltage (V)', 
              angle: -90, 
              position: 'insideLeft',
              style: { 
                fill: '#aaa', 
                fontSize: 12,
                fontWeight: 500,
                textAnchor: 'middle'
              } 
            }}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
            tickLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ 
              paddingTop: '10px',
              fontSize: '14px',
              fontWeight: 500
            }}
          />
          
          {/* Warning and critical voltage ranges */}
          <ReferenceArea 
            y1={240} 
            y2={250} 
            fill="#ffb74d" 
            fillOpacity={0.15}
            stroke="none"
          />
          <ReferenceArea 
            y1={250} 
            y2={260} 
            fill="#ff5252" 
            fillOpacity={0.15}
            stroke="none"
          />
          <ReferenceArea 
            y1={180} 
            y2={190} 
            fill="#ff5252" 
            fillOpacity={0.15}
            stroke="none"
          />
          <ReferenceArea 
            y1={190} 
            y2={210} 
            fill="#ffb74d" 
            fillOpacity={0.15}
            stroke="none"
          />
          
          <Line 
            type="monotone" 
            dataKey="phase_r" 
            name="Phase R" 
            stroke="#ff5252" 
            dot={getDotSize()}
            activeDot={{ 
              r: 6, 
              stroke: '#ff5252',
              strokeWidth: 2,
              fill: '#fff'
            }}
            strokeWidth={getStrokeWidth()}
            connectNulls={false}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Line 
            type="monotone" 
            dataKey="phase_s" 
            name="Phase S" 
            stroke="#ffb74d" 
            dot={getDotSize()}
            activeDot={{ 
              r: 6, 
              stroke: '#ffb74d',
              strokeWidth: 2,
              fill: '#fff'
            }}
            strokeWidth={getStrokeWidth()}
            connectNulls={false}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Line 
            type="monotone" 
            dataKey="phase_t" 
            name="Phase T" 
            stroke="#4caf50" 
            dot={getDotSize()}
            activeDot={{ 
              r: 6, 
              stroke: '#4caf50',
              strokeWidth: 2,
              fill: '#fff'
            }}
            strokeWidth={getStrokeWidth()}
            connectNulls={false}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ElectricalChart;