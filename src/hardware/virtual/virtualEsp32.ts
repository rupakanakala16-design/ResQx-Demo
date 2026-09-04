import type {
  HardwareCommand,
  VirtualEsp32State,
} from '../types/hardware';

export class VirtualEsp32 {
  private state: VirtualEsp32State = {
    power: true,
    network: 'ONLINE',
    sensor: 'READY',
    gpioActive: false,
  };

  getState(): VirtualEsp32State {
    return { ...this.state };
  }

  setSensorDetected(): void {
    this.state.sensor = 'DETECTED';
  }

  clearSensor(): void {
    this.state.sensor = 'CLEARED';
  }

  executeCommand(command: HardwareCommand): boolean {
    if (command.authorization !== 'APPROVED') {
      return false;
    }

    if (command.source !== 'RESQX') {
      return false;
    }

    this.state.gpioActive = true;

    return true;
  }

  resetOutputs(): void {
    this.state.gpioActive = false;
  }
}