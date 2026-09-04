# ResQX — Virtual IoT Hardware Demo

> Software-only virtual hardware demonstration for the ResQX AI-Powered Emergency Operations Command Center.

## Overview

ResQX is an emergency traffic-priority system designed to reduce ambulance delays at traffic junctions.

This repository contains the **Virtual IoT Hardware Layer** of ResQX.

The purpose of this demo is to demonstrate how an emergency event can be detected, processed by a virtual ESP32 edge controller, converted into GPIO output signals, and used to control virtual traffic signals.

The complete demonstration works **without physical hardware** and **without Wokwi**.

```text
Ambulance Emergency
        ↓
Virtual Emergency Sensor
        ↓
Virtual ESP32
        ↓
Virtual GPIO
        ↓
Traffic Signal Controller
        ↓
Emergency Green Priority
        ↓
Ambulance Passes
        ↓
Signal Restoration
        ↓
Normal Traffic
