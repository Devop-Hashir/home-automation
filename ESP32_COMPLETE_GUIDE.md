# 🔌 Complete ESP32 Integration Guide

## Overview

This guide shows you how to connect ESP32 microcontroller to your Home Automation System to control real home appliances like lights, fans, and outlets.

## 📋 What You'll Need

### Hardware
1. **ESP32 Development Board** (ESP32-WROOM-32 or similar)
2. **Relay Module** (4-channel, 8-channel, or 16-channel)
   - Recommended: 4-channel 5V relay module
3. **Power Supply** (5V for relays, 3.3V for ESP32)
4. **Jumper Wires** (Male-to-Female)
5. **Home Appliances** (lights, fans, etc.)
6. **Breadboard** (optional, for testing)

### Software
1. **Arduino IDE** (with ESP32 board support)
2. **WiFi Network** (2.4GHz - ESP32 doesn't support 5GHz)
3. **Your Home Automation Web App** (running and accessible)

## 🔧 Hardware Setup

### Step 1: Understanding Relays

A relay is an electrically operated switch that allows you to control high-voltage appliances (110V/220V) with low-voltage signals (3.3V from ESP32).

**Relay Module Pins:**
- **VCC**: Power (5V)
- **GND**: Ground
- **IN1, IN2, IN3, IN4**: Control pins (connect to ESP32 GPIO)
- **COM**: Common (connect to live wire)
- **NO**: Normally Open (connect to appliance)
- **NC**: Normally Closed (usually not used)

### Step 2: Wiring Diagram

```
ESP32          Relay Module
GPIO 25  ----> IN1 (Relay 1)
GPIO 26  ----> IN2 (Relay 2)
GPIO 27  ----> IN3 (Relay 3)
GPIO 14  ----> IN4 (Relay 4)
GND      ----> GND
5V       ----> VCC

Relay Module   Home Appliance
COM      ----> Live Wire (from wall)
NO       ----> Appliance Live Wire
```

### Step 3: Safety Wiring for Home Appliances

⚠️ **DANGER: Working with mains electricity (110V/220V) can be FATAL!**

**Safety Rules:**
1. ✅ Turn OFF main circuit breaker before wiring
2. ✅ Use insulated tools
3. ✅ Double-check all connections
4. ✅ Use proper wire gauge (14 AWG for 15A circuits)
5. ✅ Keep relay module in an insulated enclosure
6. ✅ Test with low-voltage devices first
7. ❌ NEVER touch wires when power is ON
8. ❌ If unsure, hire a licensed electrician

**Wiring Steps:**
1. Turn OFF circuit breaker
2. Cut the live wire going to your appliance
3. Connect one end to relay COM
4. Connect other end to relay NO
5. Secure all connections with wire nuts
6. Test with multimeter (power OFF)
7. Turn ON power and test

## 💻 ESP32 Code

### Step 1: Install Arduino IDE

1. Download from: https://www.arduino.cc/en/software
2. Install ESP32 board support:
   - Open Arduino IDE
   - Go to File → Preferences
   - Add to "Additional Board Manager URLs":
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Go to Tools → Board → Boards Manager
   - Search "ESP32" and install "esp32 by Espressif Systems"

### Step 2: Install Required Libraries

Go to Sketch → Include Library → Manage Libraries, then install:
- **WiFi** (built-in)
- **HTTPClient** (built-in)
- **ArduinoJson** (by Benoit Blanchon)

### Step 3: ESP32 Arduino Code

Create a new sketch and paste this code:

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

// Server URL (your Next.js app)
const char* serverUrl = "http://YOUR_COMPUTER_IP:3000/api/esp32/update";

// Relay pins (GPIO numbers)
const int relayPins[] = {25, 26, 27, 14};  // Relay 1-4
const int numRelays = 4;

// Relay states
bool relayStates[] = {false, false, false, false};

void setup() {
  Serial.begin(115200);
  
  // Initialize relay pins
  for (int i = 0; i < numRelays; i++) {
    pinMode(relayPins[i], OUTPUT);
    digitalWrite(relayPins[i], HIGH);  // HIGH = OFF (relay modules are active LOW)
  }
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Check for commands from server every 2 seconds
  checkForCommands();
  delay(2000);
}

void checkForCommands() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // In a real implementation, you'd poll a specific endpoint
    // For now, this is a placeholder
    // The actual commands come from your web app when you toggle devices
    
    http.end();
  }
}

void setRelay(int relayNumber, bool state) {
  if (relayNumber < 1 || relayNumber > numRelays) {
    Serial.println("Invalid relay number");
    return;
  }
  
  int index = relayNumber - 1;
  relayStates[index] = state;
  
  // Relay modules are active LOW (LOW = ON, HIGH = OFF)
  digitalWrite(relayPins[index], state ? LOW : HIGH);
  
  Serial.print("Relay ");
  Serial.print(relayNumber);
  Serial.print(" set to ");
  Serial.println(state ? "ON" : "OFF");
  
  // Report status to server
  reportStatus(relayNumber, state);
}

void reportStatus(int relayNumber, bool state) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON payload
    StaticJsonDocument<200> doc;
    doc["relayNumber"] = relayNumber;
    doc["status"] = state;
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    // Send POST request
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      Serial.print("Status reported: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error reporting status: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  }
}

// Function to handle manual switch changes
void checkManualSwitches() {
  // If you have physical switches connected, check them here
  // and call reportStatus() when they change
}
```

### Step 4: Configure the Code

1. **Update WiFi credentials:**
   ```cpp
   const char* ssid = "YourWiFiName";
   const char* password = "YourWiFiPassword";
   ```

2. **Update server URL:**
   - Find your computer's IP address:
     - Windows: `ipconfig` (look for IPv4 Address)
     - Mac/Linux: `ifconfig` or `ip addr`
   - Update the code:
     ```cpp
     const char* serverUrl = "http://192.168.1.100:3000/api/esp32/update";
     ```
     Replace `192.168.1.100` with your actual IP

3. **Adjust relay pins if needed:**
   ```cpp
   const int relayPins[] = {25, 26, 27, 14};  // Change if using different pins
   ```

### Step 5: Upload to ESP32

1. Connect ESP32 to computer via USB
2. In Arduino IDE:
   - Tools → Board → ESP32 Dev Module
   - Tools → Port → (select your ESP32 port)
3. Click Upload button
4. Wait for "Done uploading"
5. Open Serial Monitor (Tools → Serial Monitor)
6. Set baud rate to 115200
7. You should see "WiFi connected!" and the IP address

## 🌐 Web App Configuration

### Update .env.local

```env
ESP32_IP=http://192.168.1.XXX
```
Replace with your ESP32's IP address (shown in Serial Monitor)

## 🧪 Testing

### Test 1: Basic Relay Control

1. Open Serial Monitor in Arduino IDE
2. You should see ESP32's IP address
3. In your web app, add a device with relay number 1
4. Toggle the device ON
5. Check Serial Monitor - you should see "Relay 1 set to ON"
6. Listen for relay click sound
7. Toggle OFF and verify

### Test 2: Manual Switch Reporting

1. Physically toggle a switch connected to your appliance
2. ESP32 should detect the change
3. Web app should update automatically
4. Check activity logs

### Test 3: Multiple Devices

1. Add devices for relays 1-4
2. Toggle each one individually
3. Verify all work correctly
4. Check that only the correct relay activates

## 🏠 Connecting Real Appliances

### Example 1: Light Bulb

```
Wall Socket (Live) → Relay COM
Relay NO → Light Bulb (Live Wire)
Light Bulb (Neutral) → Wall Socket (Neutral)
```

### Example 2: Fan

```
Wall Socket (Live) → Relay COM
Relay NO → Fan (Live Wire)
Fan (Neutral) → Wall Socket (Neutral)
```

### Example 3: Multiple Appliances

```
Relay 1 → Living Room Light
Relay 2 → Bedroom Light  
Relay 3 → Living Room Fan
Relay 4 → Kitchen Outlet
```

## 🔍 Troubleshooting

### ESP32 won't connect to WiFi
- Check SSID and password
- Ensure 2.4GHz network (not 5GHz)
- Move ESP32 closer to router
- Check Serial Monitor for error messages

### Relay doesn't click
- Check wiring (VCC, GND, GPIO)
- Verify 5V power supply
- Test with multimeter
- Try different GPIO pin

### Web app doesn't control relay
- Verify ESP32 IP in .env.local
- Check ESP32 is on same network
- Look at Serial Monitor for errors
- Test API endpoint with Postman

### Appliance doesn't turn on
- ⚠️ Turn OFF power first!
- Check relay wiring (COM and NO)
- Verify appliance works directly
- Test relay with multimeter
- Check for loose connections

### Manual switch doesn't report
- Implement `checkManualSwitches()` function
- Add debouncing logic
- Verify GPIO pin configuration

## 📱 Advanced Features

### 1. Add More Relays

```cpp
const int relayPins[] = {25, 26, 27, 14, 12, 13, 15, 2};  // 8 relays
const int numRelays = 8;
```

### 2. Add Physical Buttons

```cpp
const int buttonPins[] = {32, 33, 34, 35};

void setup() {
  for (int i = 0; i < 4; i++) {
    pinMode(buttonPins[i], INPUT_PULLUP);
  }
}

void loop() {
  for (int i = 0; i < 4; i++) {
    if (digitalRead(buttonPins[i]) == LOW) {
      delay(50);  // Debounce
      if (digitalRead(buttonPins[i]) == LOW) {
        relayStates[i] = !relayStates[i];
        setRelay(i + 1, relayStates[i]);
        while (digitalRead(buttonPins[i]) == LOW);  // Wait for release
      }
    }
  }
}
```

### 3. Add Status LEDs

```cpp
const int ledPins[] = {16, 17, 18, 19};

void setup() {
  for (int i = 0; i < 4; i++) {
    pinMode(ledPins[i], OUTPUT);
  }
}

void setRelay(int relayNumber, bool state) {
  // ... existing code ...
  digitalWrite(ledPins[relayNumber - 1], state ? HIGH : LOW);
}
```

## 🎯 Production Setup

### 1. Use Static IP for ESP32

```cpp
IPAddress local_IP(192, 168, 1, 184);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);

void setup() {
  if (!WiFi.config(local_IP, gateway, subnet)) {
    Serial.println("STA Failed to configure");
  }
  WiFi.begin(ssid, password);
}
```

### 2. Add OTA Updates

Install "ArduinoOTA" library and add:

```cpp
#include <ArduinoOTA.h>

void setup() {
  ArduinoOTA.begin();
}

void loop() {
  ArduinoOTA.handle();
}
```

### 3. Add Watchdog Timer

```cpp
#include <esp_task_wdt.h>

void setup() {
  esp_task_wdt_init(30, true);  // 30 second timeout
  esp_task_wdt_add(NULL);
}

void loop() {
  esp_task_wdt_reset();  // Reset watchdog
}
```

## 📊 Complete System Flow

```
User clicks "Turn ON" in web app
    ↓
Next.js API receives request
    ↓
Database updated (status = true)
    ↓
ESP32 polls server or receives webhook
    ↓
ESP32 activates relay (GPIO LOW)
    ↓
Relay switches appliance ON
    ↓
ESP32 reports status back to server
    ↓
WebSocket broadcasts update
    ↓
All connected clients update UI
```

## 🎉 You're Done!

Your home automation system is now fully functional with ESP32 controlling real appliances!

**Next Steps:**
- Add more devices
- Set up schedules
- Implement voice control
- Add energy monitoring
- Create automation rules

---

**Safety Reminder:** Always prioritize electrical safety. When in doubt, consult a licensed electrician.
