import type {
  HardwareSignalMode,
  SignalState,
  VirtualSignalState,
} from '../types/hardware';

export class VirtualTrafficSignal {
  private signals: VirtualSignalState[] = [
    {
      junctionId: 'SIG-01',
      signal: 'RED',
      mode: 'NORMAL',
    },
    {
      junctionId: 'SIG-02',
      signal: 'RED',
      mode: 'NORMAL',
    },
    {
      junctionId: 'SIG-03',
      signal: 'RED',
      mode: 'NORMAL',
    },
  ];

  getSignals(): VirtualSignalState[] {
    return this.signals.map((signal) => ({ ...signal }));
  }

  setSignal(
    junctionId: string,
    signal: SignalState,
    mode: HardwareSignalMode,
  ): void {
    this.signals = this.signals.map((item) =>
      item.junctionId === junctionId
        ? {
            ...item,
            signal,
            mode,
          }
        : item,
    );
  }
}