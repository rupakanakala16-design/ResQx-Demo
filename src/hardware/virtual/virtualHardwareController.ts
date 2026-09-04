import { VirtualEsp32 } from './virtualEsp32';
import { VirtualGpio } from './virtualGpio';
import { VirtualTrafficSignal } from './virtualTrafficSignal';
import type {
  HardwareCommand,
  HardwareSignalMode,
  SignalState,
} from '../types/hardware';

export class VirtualHardwareController {
  private esp32 = new VirtualEsp32();
  private gpio = new VirtualGpio();
  private trafficSignals = new VirtualTrafficSignal();

  getEsp32() {
    return this.esp32.getState();
  }

  getGpioOutputs() {
    return this.gpio.getOutputs();
  }

  getTrafficSignals() {
    return this.trafficSignals.getSignals();
  }

  executeCommand(command: HardwareCommand): boolean {
    if (command.authorization !== 'APPROVED') {
      return false;
    }

    const executed = this.esp32.executeCommand(command);

    if (!executed) {
      return false;
    }

    const signal = this.modeToSignal(command.state);

    this.gpio.setSignal(command.junction, signal);

    this.trafficSignals.setSignal(
      command.junction,
      signal,
      command.state,
    );

    return true;
  }

  resetOutputs(): void {
    this.esp32.resetOutputs();
  }

  private modeToSignal(mode: HardwareSignalMode): SignalState {
    switch (mode) {
      case 'PREPARING':
        return 'YELLOW';

      case 'PRIORITY':
      case 'PASSING':
        return 'GREEN';

      case 'RESTORING':
      case 'NORMAL':
      default:
        return 'RED';
    }
  }
}