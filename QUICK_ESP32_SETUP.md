# ⚡ Quick ESP32 Setup (5 Minutes)

## What You Need
- ESP32 board
- 4-channel relay module
- Jumper wires
- Arduino IDE

## Wiring (5 connections)
```
ESP32 → Relay Module
GPIO 25 → IN1
GPIO 26 → IN2  
GPIO 27 → IN3
GPIO 14 → IN4
GND → GND
5V → VCC
```

## Code Setup

1. **Install Arduino IDE** + ESP32 support
2. **Install ArduinoJson library**
3. **Copy this code:**

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASSWORD";
const char* serverUrl = "http://YOUR_IP:3000/api/esp32/update";

const int relayPins[] = {25, 26, 27, 14};

void setup() {
  Serial.begin(115200);
  for (int i = 0; i < 4; i++) {
    pinMode(relayPins[i], OUTPUT);
    digitalWrite(relayPins[i], HIGH);
  }
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);
  Serial.println(WiFi.localIP());
}

void loop() {
  delay(2000);
}
```

4. **Update:**
   - WiFi name and password
   - Your computer's IP address

5. **Upload to ESP32**

6. **Open Serial Monitor** (115200 baud)

7. **Note the IP address shown**

## Web App Setup

1. Add device in web app
2. Set relay number (1-4)
3. Toggle ON/OFF
4. Relay should click!

## Connecting Appliances

⚠️ **DANGER: Turn OFF power first!**

```
Wall Live Wire → Relay COM
Relay NO → Appliance Live Wire
Appliance Neutral → Wall Neutral
```

## Testing

1. Add device with relay 1
2. Click "Turn ON"
3. Hear relay click
4. Appliance turns on
5. Click "Turn OFF"
6. Appliance turns off

## Troubleshooting

**WiFi won't connect:**
- Check SSID/password
- Use 2.4GHz network only

**Relay won't click:**
- Check wiring
- Verify 5V power

**App won't control:**
- Update ESP32_IP in .env.local
- Restart dev server

## Done! 🎉

Your ESP32 is now controlling appliances through your web app!

See `ESP32_COMPLETE_GUIDE.md` for detailed instructions.
