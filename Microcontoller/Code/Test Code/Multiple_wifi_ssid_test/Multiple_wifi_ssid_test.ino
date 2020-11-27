/* This program is to test if the microcontroller can switch to different wifi network when the current one is down
 * 
 */
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#define ssid1     "2 Monkeys and Dragon"
#define password1 "Sapim3nd3m"

#define ssid2     "TELUS2340"
#define password2 "f99f664c77"

#define ssid3     "Inception"
#define password3 "5XE4w%ug5!PvHwyb"

ESP8266WiFiMulti wifiMulti;
int status = WL_DISCONNECTED;

void setup() {
  Serial.begin(115200);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid2, password2);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  
  wifiMulti.addAP(ssid1, password1);
  wifiMulti.addAP(ssid2, password2);
  wifiMulti.addAP(ssid3, password3);

//  connectToWifi();
//  
//  if (wifiMulti.run() == WL_CONNECTED) {
//    Serial.println("");
//    Serial.println("WiFi connected");
//    Serial.println("IP address: ");
//    Serial.println(WiFi.localIP());
//  }
}

void connectToWifi() {
  Serial.println("Connecting Wifi...");
  while(wifiMulti.run() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("Wifi connected to ");
  Serial.println(WiFi.SSID());
  Serial.print("IP address ");
  Serial.println(WiFi.localIP());
}

void loop() {
  status = WiFi.status();
  switch (status) {
    case WL_CONNECTED:
      Serial.print("Connected to ");
      Serial.println(WiFi.SSID());
      break;
    case WL_CONNECTION_LOST:
      Serial.println("Connection is lost.");
      break;
    case WL_DISCONNECTED:
      Serial.println("Disconnected from wifi network");
      Serial.println("Try to reconnect");
      connectToWifi();
  }
  Serial.print("Wifi connection status = ");
  Serial.println(WiFi.status());
  delay(1000);
  
  // put your main code here, to run repeatedly:

}
