import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Label } from 'recharts';
import { Box, Typography } from '@mui/material';

interface GaugeChartProps {
  value: number;
  title: string;
  min: number;
  max: number;
  unit: string;
  color: string;
  thresholds: {
    warning: [number, number];
    danger: [number, number];
  };
}

const GaugeChart = ({ value, title, min, max, unit, color, thresholds }: GaugeChartProps) => {
  const range = max - min;
  const normalizedValue = Math.max(Math.min(value, max), min) - min;
  const percentage = (normalizedValue / range) * 100;

  // Create data for the gauge
  const data = [
    { name: 'Value', value: percentage },
    { name: 'Empty', value: 100 - percentage },
  ];

  // Calculate zones (normal, warning, danger) for the background
  const normalLow = ((thresholds.warning[0] - min) / range) * 100;
  const warningLow = ((thresholds.danger[0] - min) / range) * 100;
  const warningHigh = ((thresholds.warning[1] - min) / range) * 100;
  const normalHigh = ((thresholds.danger[1] - min) / range) * 100;

  // Background zones data
  const backgroundData = [
    { name: 'Danger Low', value: warningLow, color: '#ff5252' },
    { name: 'Warning Low', value: normalLow - warningLow, color: '#ffb74d' },
    { name: 'Normal', value: warningHigh - normalLow, color: '#4caf50' },
    { name: 'Warning High', value: normalHigh - warningHigh, color: '#ffb74d' },
    { name: 'Danger High', value: 100 - normalHigh, color: '#ff5252' },
  ];

  // Get status based on value
  const getStatus = () => {
    if (value <= thresholds.danger[0] || value >= thresholds.danger[1]) return 'CRITICAL';
    if (value <= thresholds.warning[0] || value >= thresholds.warning[1]) return 'WARNING';
    return 'NORMAL';
  };

  const status = getStatus();

  return (
    <Box sx={{ width: '100%', height: 320, position: 'relative' }}>
      <Typography 
        variant="h6" 
        sx={{ 
          textAlign: 'center', 
          mb: 1,
          fontWeight: 600,
          color: 'text.primary',
          fontSize: '1.1rem'
        }}
      >
        {title}
      </Typography>
      
      {/* Status indicator at top */}
      <Box
        sx={{
          position: 'absolute',
          top: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          px: 2,
          py: 0.5,
          borderRadius: 2,
          bgcolor: `${color}20`,
          border: `1px solid ${color}`,
          backdropFilter: 'blur(10px)',
          zIndex: 10,
        }}
      >
        <Typography 
          variant="caption" 
          sx={{ 
            color: color,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontSize: '0.75rem'
          }}
        >
          {status}
        </Typography>
      </Box>
      
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Background zones */}
          <Pie
            data={backgroundData}
            cx="50%"
            cy="70%"
            startAngle={180}
            endAngle={0}
            innerRadius={90}
            outerRadius={110}
            paddingAngle={0}
            dataKey="value"
          >
            {backgroundData.map((entry, index) => (
              <Cell key={`cell-bg-${index}`} fill={entry.color} />
            ))}
          </Pie>
          
          {/* Value gauge */}
          <Pie
            data={data}
            cx="50%"
            cy="70%"
            startAngle={180}
            endAngle={0}
            innerRadius={70}
            outerRadius={90}
            paddingAngle={0}
            dataKey="value"
          >
            <Cell fill={color} />
            <Cell fill="transparent" />
            <Label
              content={({ viewBox }) => {
                const { cx, cy } = viewBox as { cx: number; cy: number };
                return (
                  <g>
                    <text
                      x={cx}
                      y={cy - 15}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#fff"
                      fontSize="32"
                      fontWeight="bold"
                    >
                      {value.toFixed(1)}
                    </text>
                    <text
                      x={cx}
                      y={cy + 15}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#aaa"
                      fontSize="18"
                      fontWeight="500"
                    >
                      {unit}
                    </text>
                  </g>
                );
              }}
            />
          </Pie>
          
          <Tooltip 
            formatter={(value: number, name: string) => [
              name === 'Value' ? `${value.toFixed(1)}%` : '', 
              name === 'Value' ? 'Value' : ''
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Min/Max labels */}
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: 30, 
          left: 0, 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between',
          px: 3
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {min}{unit}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {max}{unit}
        </Typography>
      </Box>
    </Box>
  );
};

export default GaugeChart;