#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "YOUR_MQTT_BROKER_IP";

const int thermistorPin = 34; // Analog pin for thermistor
const char* machine_id = "MACHINE_001";

WiFiClient espClient;
PubSubClient client(espClient);

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
  Serial.println("\nWiFi connected");
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect(machine_id)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Read analog value from thermistor
  int analogValue = analogRead(thermistorPin);
  
  // Calculate temperature (Steinhart-Hart equation or simplified voltage divider logic could go here)
  float voltage = analogValue * (3.3 / 4095.0);
  float temperature_celsius = (voltage - 0.5) * 100.0; // Simulated mapping for example
  
  // Construct JSON Payload
  StaticJsonDocument<200> doc;
  doc["machine_id"] = machine_id;
  doc["temperature_celsius"] = temperature_celsius;
  doc["timestamp"] = millis(); // In a real scenario, use NTP time

  char jsonBuffer[256];
  serializeJson(doc, jsonBuffer);

  // Publish to MQTT Cloud Endpoint
  client.publish("factory/telemetry", jsonBuffer);
  
  Serial.print("Published: ");
  Serial.println(jsonBuffer);

  // Publish every 5 seconds
  delay(5000);
}
