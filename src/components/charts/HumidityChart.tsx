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
  value: number;
}

interface HumidityChartProps {
  nocData: DataPoint[];
  upsData: DataPoint[];
  timeRange: string;
  zoomLevel?: number;
}

const HumidityChart = ({ nocData, upsData, timeRange, zoomLevel = 1 }: HumidityChartProps) => {
  // Combine data for chart with proper interpolation
  const mergedData = nocData.map((item, index) => ({
    timestamp: item.timestamp,
    nocHumidity: item.value,
    upsHumidity: upsData[index]?.value || null,
  }));

  // Format x-axis ticks based on time range and zoom level
  const formatXAxis = (tickItem: string) => {
    try {
      const date = parseISO(tickItem);
      if (timeRange === '24h' || zoomLevel > 2) {
        return format(date, 'HH:mm');
      } else if (timeRange === '7d') {
        return format(date, 'dd/MM');
      } else {
        return format(date, 'dd/MM');
      }
    } catch (error) {
      return '';
    }
  };

  // Calculate optimal tick interval based on zoom level and data length
  const getTickInterval = () => {
    const dataLength = mergedData.length;
    if (dataLength === 0) return 0;
    
    if (zoomLevel >= 4) {
      return Math.max(1, Math.floor(dataLength / 20));
    } else if (zoomLevel >= 2) {
      return Math.max(1, Math.floor(dataLength / 15));
    } else {
      return Math.max(1, Math.floor(dataLength / 10));
    }
  };

  // Get optimal stroke width based on zoom level
  const getStrokeWidth = () => {
    if (zoomLevel >= 4) return 3;
    if (zoomLevel >= 2) return 2.5;
    return 2;
  };

  // Get dot size based on zoom level
  const getDotSize = () => {
    if (zoomLevel >= 4) return 4;
    if (zoomLevel >= 3) return 3;
    return false;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      try {
        const date = parseISO(label);
        const formattedDate = format(date, 'dd MMM yyyy HH:mm');
        
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
                {entry.name}: {entry.value?.toFixed(1)}%
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

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={mergedData}
          margin={{ 
            top: 5, 
            right: 30, 
            left: 20, 
            bottom: zoomLevel > 3 ? 60 : 30 
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
              fontSize: zoomLevel > 3 ? 10 : 12,
              fontWeight: 500
            }}
            interval={getTickInterval()}
            angle={zoomLevel > 3 ? -45 : 0}
            textAnchor={zoomLevel > 3 ? 'end' : 'middle'}
            height={zoomLevel > 3 ? 60 : 30}
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
            domain={[30, 90]}
            label={{ 
              value: 'Humidity (%)', 
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
          
          {/* Warning and critical humidity ranges */}
          <ReferenceArea 
            y1={70} 
            y2={80} 
            fill="#ffb74d" 
            fillOpacity={0.15}
            stroke="none"
          />
          <ReferenceArea 
            y1={80} 
            y2={90} 
            fill="#ff5252" 
            fillOpacity={0.15}
            stroke="none"
          />
          
          <Line 
            type="monotone" 
            dataKey="nocHumidity" 
            name="NOC Humidity" 
            stroke="#29b6f6" 
            dot={getDotSize()}
            activeDot={{ 
              r: 6, 
              stroke: '#29b6f6',
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
            dataKey="upsHumidity" 
            name="UPS Humidity" 
            stroke="#64b5f6" 
            dot={getDotSize()}
            activeDot={{ 
              r: 6, 
              stroke: '#64b5f6',
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

export default HumidityChart;