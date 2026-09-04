import type { SignalState } from '../types/hardware';

export interface VirtualGpioOutput {
  pin: number;
  junctionId: string;
  signal: SignalState;
  active: boolean;
}

export class VirtualGpio {
  private outputs: VirtualGpioOutput[] = [
    { pin: 18, junctionId: 'SIG-01', signal: 'RED', active: true },
    { pin: 19, junctionId: 'SIG-01', signal: 'YELLOW', active: false },
    { pin: 21, junctionId: 'SIG-01', signal: 'GREEN', active: false },

    { pin: 22, junctionId: 'SIG-02', signal: 'RED', active: true },
    { pin: 23, junctionId: 'SIG-02', signal: 'YELLOW', active: false },
    { pin: 25, junctionId: 'SIG-02', signal: 'GREEN', active: false },

    { pin: 26, junctionId: 'SIG-03', signal: 'RED', active: true },
    { pin: 27, junctionId: 'SIG-03', signal: 'YELLOW', active: false },
    { pin: 32, junctionId: 'SIG-03', signal: 'GREEN', active: false },
  ];

  getOutputs(): VirtualGpioOutput[] {
    return this.outputs.map((output) => ({ ...output }));
  }

  setSignal(
    junctionId: string,
    signal: SignalState,
  ): void {
    this.outputs = this.outputs.map((output) => ({
      ...output,
      active:
        output.junctionId === junctionId &&
        output.signal === signal,
    }));
  }

  getJunctionOutputs(junctionId: string): VirtualGpioOutput[] {
    return this.outputs
      .filter((output) => output.junctionId === junctionId)
      .map((output) => ({ ...output }));
  }
}