export type HardwareConnectionStatus =
  | 'OFFLINE'
  | 'CONNECTING'
  | 'ONLINE';

export type SensorStatus =
  | 'READY'
  | 'DETECTED'
  | 'CLEARED';

export type SignalState =
  | 'RED'
  | 'YELLOW'
  | 'GREEN';

export type HardwareSignalMode =
  | 'NORMAL'
  | 'PREPARING'
  | 'PRIORITY'
  | 'PASSING'
  | 'RESTORING';

export interface VirtualEsp32State {
  power: boolean;
  network: HardwareConnectionStatus;
  sensor: SensorStatus;
  gpioActive: boolean;
}

export interface VirtualSignalState {
  junctionId: string;
  signal: SignalState;
  mode: HardwareSignalMode;
}

export interface HardwareCommand {
  junction: string;
  state: HardwareSignalMode;
  source: 'RESQX';
  authorization: 'APPROVED' | 'BLOCKED';
}