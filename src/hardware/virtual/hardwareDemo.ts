import { VirtualHardwareController } from './virtualHardwareController';
import { VirtualEmergencySensor } from './virtualEmergencySensor';

export type HardwareDemoStage =
  | 'IDLE'
  | 'DETECTED'
  | 'PREPARING'
  | 'PRIORITY'
  | 'PASSING'
  | 'RESTORING'
  | 'COMPLETED';

export interface HardwareDemoState {
  stage: HardwareDemoStage;
  ambulanceId: string;
  junctionId: string;
  elapsedSeconds: number;
  message: string;
}

export class HardwareDemo {
  private controller = new VirtualHardwareController();
  private sensor = new VirtualEmergencySensor();

  private state: HardwareDemoState = {
    stage: 'IDLE',
    ambulanceId: 'AMB-01',
    junctionId: 'SIG-01',
    elapsedSeconds: 0,
    message: 'Ready for emergency simulation',
  };

  getState(): HardwareDemoState {
    return { ...this.state };
  }

  getHardware() {
    return {
      esp32: this.controller.getEsp32(),
      gpio: this.controller.getGpioOutputs(),
      signals: this.controller.getTrafficSignals(),
    };
  }

  start(): void {
    this.sensor.reset();
    this.controller.resetOutputs();

    const event = this.sensor.detectAmbulance('AMB-01');

    this.state = {
      stage: 'DETECTED',
      ambulanceId: event.ambulanceId,
      junctionId: 'SIG-01',
      elapsedSeconds: 0,
      message: 'Emergency ambulance detected',
    };
  }

  prepare(): void {
    this.executeApproved('PREPARING');

    this.state = {
      ...this.state,
      stage: 'PREPARING',
      message: 'ESP32 preparing junction SIG-01',
    };
  }

  activatePriority(): void {
    this.executeApproved('PRIORITY');

    this.state = {
      ...this.state,
      stage: 'PRIORITY',
      message: 'Emergency priority signal activated',
    };
  }

  passAmbulance(): void {
    this.executeApproved('PASSING');

    this.state = {
      ...this.state,
      stage: 'PASSING',
      message: 'Ambulance passing through green signal',
    };
  }

  restore(): void {
    this.executeApproved('RESTORING');

    this.state = {
      ...this.state,
      stage: 'RESTORING',
      message: 'Restoring normal traffic operation',
    };
  }

  complete(): void {
    this.executeApproved('NORMAL');

    this.sensor.clear();

    this.state = {
      ...this.state,
      stage: 'COMPLETED',
      message: 'Emergency hardware sequence completed',
    };
  }

  reset(): void {
    this.sensor.reset();
    this.controller.resetOutputs();

    this.state = {
      stage: 'IDLE',
      ambulanceId: 'AMB-01',
      junctionId: 'SIG-01',
      elapsedSeconds: 0,
      message: 'Ready for emergency simulation',
    };
  }

  private executeApproved(
    state: 'NORMAL' | 'PREPARING' | 'PRIORITY' | 'PASSING' | 'RESTORING',
  ): void {
    this.controller.executeCommand({
      junction: this.state.junctionId,
      state,
      source: 'RESQX',
      authorization: 'APPROVED',
    });
  }
}