import { useMemo, useState } from 'react';
import { VirtualHardwareController } from '../virtual/virtualHardwareController';
import { VirtualEmergencySensor } from '../virtual/virtualEmergencySensor';
import type {
  HardwareSignalMode,
  SignalState,
} from '../types/hardware';

const controller = new VirtualHardwareController();
const sensor = new VirtualEmergencySensor();

const signalColor: Record<SignalState, string> = {
  RED: '#ef4444',
  YELLOW: '#f59e0b',
  GREEN: '#22c55e',
};

const modeLabel: Record<HardwareSignalMode, string> = {
  NORMAL: 'NORMAL',
  PREPARING: 'PREPARING',
  PRIORITY: 'PRIORITY',
  PASSING: 'PASSING',
  RESTORING: 'RESTORING',
};

export default function VirtualHardwareDashboard() {
  const [sensorStatus, setSensorStatus] = useState(
    sensor.getStatus(),
  );

  const [signals, setSignals] = useState(
    controller.getTrafficSignals(),
  );

  const [esp32, setEsp32] = useState(
    controller.getEsp32(),
  );

  const [lastCommand, setLastCommand] = useState('NONE');
  const [safetyStatus, setSafetyStatus] = useState('—');

  const [demoRunning, setDemoRunning] = useState(false);
  const [demoStage, setDemoStage] = useState('IDLE');

  const gpioOutputs = useMemo(
    () => controller.getGpioOutputs(),
    [signals],
  );

  const detectAmbulance = () => {
    if (demoRunning) return;

    const event = sensor.detectAmbulance('AMB-01');

    setSensorStatus(event.status);
    setSafetyStatus('EVENT SENT TO RESQX');
    setLastCommand('EMERGENCY DETECTED');
    setDemoStage('DETECTED');
  };

  const clearSensor = () => {
    if (demoRunning) return;

    sensor.clear();
    controller.resetOutputs();

    setSensorStatus('READY');
    setSignals(controller.getTrafficSignals());
    setEsp32(controller.getEsp32());
    setSafetyStatus('—');
    setLastCommand('NONE');
    setDemoStage('IDLE');
  };

  const simulateApprovedCommand = (
    junctionId: string,
    mode: HardwareSignalMode,
  ) => {
    if (demoRunning) return;

    const executed = controller.executeCommand({
      junction: junctionId,
      state: mode,
      source: 'RESQX',
      authorization: 'APPROVED',
    });

    if (executed) {
      setSignals(controller.getTrafficSignals());
      setEsp32(controller.getEsp32());
      setSafetyStatus('APPROVED');
      setLastCommand(`${junctionId} → ${modeLabel[mode]}`);
      setDemoStage(modeLabel[mode]);
    }
  };

  const simulateBlockedCommand = () => {
    if (demoRunning) return;

    controller.executeCommand({
      junction: 'SIG-01',
      state: 'PRIORITY',
      source: 'RESQX',
      authorization: 'BLOCKED',
    });

    setSafetyStatus('BLOCKED');
    setLastCommand('COMMAND REJECTED');
  };

  /*
   * COMPLETE AUTOMATIC EMERGENCY DEMO
   *
   * AMB-01
   *   ↓
   * Emergency detection
   *   ↓
   * SIG-01
   *   PREPARING → PRIORITY → PASSING → RESTORING → NORMAL
   *   ↓
   * SIG-02
   *   PREPARING → PRIORITY → PASSING → RESTORING → NORMAL
   *   ↓
   * SIG-03
   *   PREPARING → PRIORITY → PASSING → RESTORING → NORMAL
   *   ↓
   * Hospital
   */

  const startEmergencyDemo = async () => {
    if (demoRunning) return;

    setDemoRunning(true);

    // Reset complete virtual hardware system
    sensor.reset();
    controller.resetOutputs();

    setSensorStatus('READY');
    setSignals(controller.getTrafficSignals());
    setEsp32(controller.getEsp32());
    setDemoStage('INITIALIZING');
    setLastCommand('SYSTEM RESET');
    setSafetyStatus('SYSTEM READY');

    await wait(1000);

    // ==========================================
    // STEP 1 — EMERGENCY DETECTION
    // ==========================================

    const event = sensor.detectAmbulance('AMB-01');

    setSensorStatus(event.status);
    setDemoStage('DETECTED');
    setLastCommand('AMB-01 DETECTED');
    setSafetyStatus('EVENT SENT TO RESQX');

    await wait(1500);

    // ==========================================
    // STEP 2 — PROCESS ALL THREE JUNCTIONS
    // ==========================================

    const junctions = ['SIG-01', 'SIG-02', 'SIG-03'];

    for (const junctionId of junctions) {
      // ----------------------------------------
      // PREPARING
      // ----------------------------------------

      controller.executeCommand({
        junction: junctionId,
        state: 'PREPARING',
        source: 'RESQX',
        authorization: 'APPROVED',
      });

      setSignals(controller.getTrafficSignals());
      setEsp32(controller.getEsp32());

      setDemoStage(`${junctionId} PREPARING`);
      setLastCommand(`${junctionId} → PREPARING`);
      setSafetyStatus('APPROVED');

      await wait(1800);

      // ----------------------------------------
      // PRIORITY
      // ----------------------------------------

      controller.executeCommand({
        junction: junctionId,
        state: 'PRIORITY',
        source: 'RESQX',
        authorization: 'APPROVED',
      });

      setSignals(controller.getTrafficSignals());
      setEsp32(controller.getEsp32());

      setDemoStage(`${junctionId} PRIORITY`);
      setLastCommand(`${junctionId} → PRIORITY`);
      setSafetyStatus('APPROVED');

      await wait(2200);

      // ----------------------------------------
      // AMBULANCE PASSING
      // ----------------------------------------

      controller.executeCommand({
        junction: junctionId,
        state: 'PASSING',
        source: 'RESQX',
        authorization: 'APPROVED',
      });

      setSignals(controller.getTrafficSignals());
      setEsp32(controller.getEsp32());

      setDemoStage(`${junctionId} PASSING`);
      setLastCommand(`AMB-01 PASSING ${junctionId}`);
      setSafetyStatus('APPROVED');

      await wait(2200);

      // ----------------------------------------
      // RESTORING
      // ----------------------------------------

      controller.executeCommand({
        junction: junctionId,
        state: 'RESTORING',
        source: 'RESQX',
        authorization: 'APPROVED',
      });

      setSignals(controller.getTrafficSignals());
      setEsp32(controller.getEsp32());

      setDemoStage(`${junctionId} RESTORING`);
      setLastCommand(`${junctionId} → RESTORING`);
      setSafetyStatus('APPROVED');

      await wait(1600);

      // ----------------------------------------
      // NORMAL TRAFFIC
      // ----------------------------------------

      controller.executeCommand({
        junction: junctionId,
        state: 'NORMAL',
        source: 'RESQX',
        authorization: 'APPROVED',
      });

      setSignals(controller.getTrafficSignals());
      setEsp32(controller.getEsp32());

      setDemoStage(`${junctionId} NORMAL`);
      setLastCommand(`${junctionId} → NORMAL`);
      setSafetyStatus('APPROVED');

      await wait(1000);
    }

    // ==========================================
    // STEP 3 — EMERGENCY COMPLETED
    // ==========================================

    sensor.clear();

    setSignals(controller.getTrafficSignals());
    setEsp32(controller.getEsp32());

    setSensorStatus('CLEARED');
    setDemoStage('COMPLETED');
    setLastCommand('AMB-01 → HOSPITAL');
    setSafetyStatus('SEQUENCE COMPLETED');

    setDemoRunning(false);
  };

  return (
    <main className="hardware-dashboard">
      <header className="hardware-header">
        <div>
          <p className="eyebrow">
            RESQX / HARDWARE LAYER
          </p>

          <h1>Virtual IoT Hardware</h1>

          <p>
            Software-in-the-loop simulation of the
            emergency traffic edge controller.
          </p>
        </div>

        <div className="system-status">
          <span className="status-dot online" />
          SYSTEM ONLINE
        </div>
      </header>

      {/* ======================================
          TOP HARDWARE DEVICES
      ====================================== */}

      <section className="hardware-grid">

        {/* EMERGENCY SENSOR */}

        <article className="hardware-card sensor-card">
          <div className="card-title">
            <span>📡</span>

            <div>
              <p>INPUT DEVICE</p>
              <h2>Emergency Sensor</h2>
            </div>
          </div>

          <div className="device-id">
            SENSOR-01
          </div>

          <div className="device-id">
            DEMO STAGE: {demoStage}
          </div>

          <div className="large-status">
            <span
              className={`status-dot ${
                sensorStatus === 'DETECTED'
                  ? 'active'
                  : 'online'
              }`}
            />

            {sensorStatus}
          </div>

          <p className="device-description">
            Virtual ambulance detection input for AMB-01.
          </p>

          <div className="button-row">
            <button
              onClick={startEmergencyDemo}
              disabled={demoRunning}
            >
              {demoRunning
                ? 'EMERGENCY DEMO RUNNING...'
                : 'START EMERGENCY DEMO'}
            </button>

            <button
              className="secondary"
              onClick={detectAmbulance}
              disabled={demoRunning}
            >
              DETECT AMBULANCE
            </button>

            <button
              className="secondary"
              onClick={clearSensor}
              disabled={demoRunning}
            >
              RESET
            </button>
          </div>
        </article>

        {/* ESP32 */}

        <article className="hardware-card esp-card">
          <div className="card-title">
            <span>🧠</span>

            <div>
              <p>EDGE DEVICE</p>
              <h2>Virtual ESP32</h2>
            </div>
          </div>

          <div className="device-id">
            ESP32 DEVKIT V1
          </div>

          <div className="esp-status-grid">
            <StatusRow
              label="POWER"
              value={esp32.power ? 'ON' : 'OFF'}
              online={esp32.power}
            />

            <StatusRow
              label="NETWORK"
              value={esp32.network}
              online={esp32.network === 'ONLINE'}
            />

            <StatusRow
              label="SENSOR"
              value={esp32.sensor}
              online={esp32.sensor !== 'READY'}
            />

            <StatusRow
              label="GPIO"
              value={
                esp32.gpioActive
                  ? 'ACTIVE'
                  : 'READY'
              }
              online={esp32.gpioActive}
            />
          </div>
        </article>
      </section>

      {/* ======================================
          NETWORK
      ====================================== */}

      <section className="network-card">
        <div>
          <p className="eyebrow">
            NETWORK COMMUNICATION
          </p>

          <h2>
            Virtual ResQX ↔ Edge Connection
          </h2>
        </div>

        <div className="network-flow">
          <span>RESQX</span>

          <span>→</span>

          <span className="network-online">
            ONLINE
          </span>

          <span>→</span>

          <span>ESP32</span>
        </div>
      </section>

      {/* ======================================
          TRAFFIC SIGNALS
      ====================================== */}

      <section className="signals-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              ACTUATOR OUTPUT
            </p>

            <h2>
              Virtual Traffic Signals
            </h2>
          </div>

          <div className="command-status">
            <span>
              SAFETY:{' '}
              <strong>{safetyStatus}</strong>
            </span>

            <span>
              COMMAND:{' '}
              <strong>{lastCommand}</strong>
            </span>
          </div>
        </div>

        <div className="signal-grid">
          {signals.map((signal) => (
            <article
              className="signal-card"
              key={signal.junctionId}
            >
              <div className="signal-header">
                <span>🚦</span>

                <div>
                  <p>JUNCTION</p>

                  <h3>
                    {signal.junctionId}
                  </h3>
                </div>
              </div>

              <div className="signal-mode">
                {modeLabel[signal.mode]}
              </div>

              <div className="traffic-light">
                <Light
                  label="RED"
                  active={
                    signal.signal === 'RED'
                  }
                />

                <Light
                  label="YELLOW"
                  active={
                    signal.signal === 'YELLOW'
                  }
                />

                <Light
                  label="GREEN"
                  active={
                    signal.signal === 'GREEN'
                  }
                />
              </div>

              <div className="signal-controls">
                <button
                  disabled={demoRunning}
                  onClick={() =>
                    simulateApprovedCommand(
                      signal.junctionId,
                      'PREPARING',
                    )
                  }
                >
                  PREPARE
                </button>

                <button
                  disabled={demoRunning}
                  onClick={() =>
                    simulateApprovedCommand(
                      signal.junctionId,
                      'PRIORITY',
                    )
                  }
                >
                  PRIORITY
                </button>

                <button
                  className="secondary"
                  disabled={demoRunning}
                  onClick={() =>
                    simulateApprovedCommand(
                      signal.junctionId,
                      'NORMAL',
                    )
                  }
                >
                  NORMAL
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ======================================
          GPIO + SAFETY
      ====================================== */}

      <section className="bottom-grid">

        {/* GPIO MONITOR */}

        <article className="hardware-card">
          <p className="eyebrow">
            GPIO MONITOR
          </p>

          <h2>
            Virtual ESP32 Outputs
          </h2>

          <div className="gpio-list">
            {gpioOutputs.map((output) => (
              <div
                className="gpio-row"
                key={`${output.junctionId}-${output.signal}`}
              >
                <span>
                  GPIO {output.pin}
                </span>

                <span>
                  {output.junctionId}
                </span>

                <span>
                  {output.signal}
                </span>

                <strong
                  style={{
                    color: output.active
                      ? signalColor[
                          output.signal
                        ]
                      : '#64748b',
                  }}
                >
                  {output.active
                    ? 'HIGH'
                    : 'LOW'}
                </strong>
              </div>
            ))}
          </div>
        </article>

        {/* SAFETY */}

        <article className="hardware-card safety-card">
          <p className="eyebrow">
            SAFETY GATE TEST
          </p>

          <h2>
            Command Authorization
          </h2>

          <p>
            The virtual hardware only executes
            commands authorized by the ResQX
            control layer.
          </p>

          <button
            className="danger-test"
            disabled={demoRunning}
            onClick={simulateBlockedCommand}
          >
            SEND BLOCKED COMMAND
          </button>

          <div className="safety-result">
            <strong>
              {safetyStatus}
            </strong>

            <span>
              {safetyStatus === 'BLOCKED'
                ? 'Signal output unchanged'
                : 'Awaiting command'}
            </span>
          </div>
        </article>
      </section>
    </main>
  );
}

/* ============================================
   STATUS ROW
============================================ */

function StatusRow({
  label,
  value,
  online,
}: {
  label: string;
  value: string;
  online: boolean;
}) {
  return (
    <div className="status-row">
      <span>{label}</span>

      <strong>
        <span
          className={`status-dot ${
            online
              ? 'online'
              : 'inactive'
          }`}
        />

        {value}
      </strong>
    </div>
  );
}

/* ============================================
   TRAFFIC LIGHT
============================================ */

function Light({
  label,
  active,
}: {
  label: SignalState;
  active: boolean;
}) {
  return (
    <div className="light-row">
      <span
        className="traffic-light-dot"
        style={{
          backgroundColor: active
            ? signalColor[label]
            : '#1e293b',

          boxShadow: active
            ? `0 0 18px ${signalColor[label]}`
            : 'none',
        }}
      />

      <span>{label}</span>
    </div>
  );
}

/* ============================================
   DELAY HELPER
============================================ */

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}