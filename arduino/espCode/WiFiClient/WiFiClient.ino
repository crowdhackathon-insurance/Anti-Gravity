#include <ESP8266WiFi.h>

const char* ssid     = "teat";
const char* password = "wirmussen13";

WiFiClient client;
const char* clientId = "ClientID";
const char* serverIp = "192.168.43.174";
int port = 6667;

void setup() {

    Serial.begin(115200);

    delay(10);

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
    }

    if (!client.connect(serverIp, port)) {
        return;
    }
    client.print(clientId);
}


void loop() {
    if (!client.connected()) {
        if (!client.connect(serverIp, port)) {
            return;
        }
        client.print(clientId);
    }
    if (Serial.available()) {
       client.print(Serial.readString());
    }
    delay(10);
}
