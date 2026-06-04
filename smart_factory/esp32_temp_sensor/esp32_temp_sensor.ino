#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "YOUR_MQTT_BROKER_IP";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

const int THERMISTOR_PIN = 34; // Analog pin for ESP32
const String MACHINE_ID = "MCH-001";
const unsigned long PUBLISH_INTERVAL = 5000;
unsigned long lastPublishTime = 0;

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

float readTemperature() {
  // Simple thermistor reading (Steinhart-Hart equation or lookup table usually applied here)
  // For demonstration, mapping analog value to a dummy temperature range
  int rawValue = analogRead(THERMISTOR_PIN);
  float voltage = rawValue * (3.3 / 4095.0);
  float tempC = (voltage - 0.5) * 100.0; // Example conversion
  return tempC;
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastPublishTime > PUBLISH_INTERVAL) {
    lastPublishTime = now;

    float tempC = readTemperature();
    
    StaticJsonDocument<200> doc;
    doc["machine_id"] = MACHINE_ID;
    doc["temperature_celsius"] = tempC;
    // timestamp would typically be generated server-side if ESP32 lacks RTC, 
    // or synced via NTP.
    doc["timestamp"] = millis(); 

    char jsonBuffer[512];
    serializeJson(doc, jsonBuffer);

    Serial.print("Publishing message: ");
    Serial.println(jsonBuffer);
    
    client.publish("factory/sensors/temperature", jsonBuffer);
  }
}
