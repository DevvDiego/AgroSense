export interface SensorReading {
  temperature: number;
  humidity: number;
  battery: number;
  timestamp: string;
}

export interface Sensor {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'alert';
  lastReading: SensorReading | null;
}

const locations = [
  'Warehouse A', 'Warehouse B', 'Cold Storage', 'Server Room',
  'Greenhouse 1', 'Greenhouse 2', 'Office Floor', 'Rooftop'
];

function randomReading(): SensorReading {
  return {
    temperature: +(15 + Math.random() * 15).toFixed(1),
    humidity: +(30 + Math.random() * 50).toFixed(1),
    battery: +(10 + Math.random() * 90).toFixed(0),
    timestamp: new Date().toISOString()
  };
}

function generateSensors(): Sensor[] {
  const statuses: Sensor['status'][] = ['online', 'online', 'online', 'offline', 'alert'];
  return locations.map((loc, i) => ({
    id: `SENSOR-${String(i + 1).padStart(3, '0')}`,
    name: `${loc} Sensor`,
    location: loc,
    status: statuses[i % statuses.length],
    lastReading: Math.random() > 0.2 ? randomReading() : null
  }));
}

// Initial static data
export const initialSensors: Sensor[] = generateSensors();

// Simulate a live update (returns a new array with randomly changed values)
export function updateSensors(prev: Sensor[]): Sensor[] {
    return prev.map((s) => {
      if (s.status === 'offline') return s;
      // 10% chance to change status
      const r = Math.random();
      let newStatus = s.status;
      if (r < 0.02) newStatus = 'offline';
      else if (r < 0.05) newStatus = 'alert';
      else if (r < 0.1 && s.status === 'offline') newStatus = 'online';
      return {
        ...s,
        status: newStatus,
        lastReading: newStatus === 'offline' ? null : randomReading()
      };
    });
}