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

  return (
    <Box sx={{ width: '100%', height: 280, position: 'relative' }}>
      <Typography 
        variant="h6" 
        sx={{ 
          textAlign: 'center', 
          mb: 2,
          fontWeight: 600,
          color: 'text.primary'
        }}
      >
        {title}
      </Typography>
      
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Background zones */}
          <Pie
            data={backgroundData}
            cx="50%"
            cy="75%"
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={95}
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
            cy="75%"
            startAngle={180}
            endAngle={0}
            innerRadius={65}
            outerRadius={80}
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
                      y={cy - 10}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#fff"
                      fontSize="28"
                      fontWeight="bold"
                    >
                      {value.toFixed(1)}
                    </text>
                    <text
                      x={cx}
                      y={cy + 20}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#aaa"
                      fontSize="16"
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
      
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: 20, 
          left: 0, 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between',
          px: 2
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {min}{unit}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {max}{unit}
        </Typography>
      </Box>
      
      {/* Status indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 50,
          left: '50%',
          transform: 'translateX(-50%)',
          px: 2,
          py: 0.5,
          borderRadius: 2,
          bgcolor: `${color}20`,
          border: `1px solid ${color}`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography 
          variant="caption" 
          sx={{ 
            color: color,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1
          }}
        >
          {percentage < 20 || percentage > 80 ? 'ALERT' : 
           percentage < 30 || percentage > 70 ? 'WARNING' : 'NORMAL'}
        </Typography>
      </Box>
    </Box>
  );
};

export default GaugeChart;