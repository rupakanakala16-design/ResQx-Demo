# 🚑 ResQX — Virtual IoT Hardware Emergency Demo

<p align="center">
  <b>AI-Powered Emergency Operations Command Center — Virtual Hardware Layer</b>
</p>

<p align="center">
  🚑 Emergency Detection • 🧠 Virtual ESP32 • ⚡ Virtual GPIO • 🚦 Smart Traffic Signals
</p>

---

## 🌐 Project Overview

**ResQX** is an emergency traffic-management system designed to reduce ambulance delays caused by traffic congestion and red signals.

This repository contains the **Virtual IoT Hardware Demonstration Layer** of ResQX.

The purpose of this project is to demonstrate how the software control system would interact with real-world embedded hardware **without requiring physical electronic components**.

Instead of connecting an actual ESP32, sensors, LEDs, relays, or traffic-light hardware, this project provides a **software-in-the-loop virtual hardware environment**.

The complete demonstration runs directly in the browser.

---

# 🎯 Purpose

The hardware layer demonstrates the following real-world concept:

```text
🚑 Ambulance Emergency
        ↓
📡 Emergency Detection
        ↓
🧠 ESP32 Edge Controller
        ↓
📡 Command Received
        ↓
⚡ GPIO Output
        ↓
🚦 Traffic Signal Controller
        ↓
🟢 Emergency Green Signal
        ↓
🚑 Ambulance Passes
        ↓
🔄 Signal Restoration
        ↓
🚦 Normal Traffic
