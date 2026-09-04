import type { SensorStatus } from '../types/hardware';

export interface EmergencySensorEvent {
  sensorId: string;
  ambulanceId: string;
  status: SensorStatus;
  timestamp: number;
}

export class VirtualEmergencySensor {
  private status: SensorStatus = 'READY';

  getStatus(): SensorStatus {
    return this.status;
  }

  detectAmbulance(
    ambulanceId: string = 'AMB-01',
  ): EmergencySensorEvent {
    this.status = 'DETECTED';

    return {
      sensorId: 'SENSOR-01',
      ambulanceId,
      status: 'DETECTED',
      timestamp: Date.now(),
    };
  }

  clear(): EmergencySensorEvent {
    this.status = 'CLEARED';

    return {
      sensorId: 'SENSOR-01',
      ambulanceId: 'AMB-01',
      status: 'CLEARED',
      timestamp: Date.now(),
    };
  }

  reset(): void {
    this.status = 'READY';
  }
}