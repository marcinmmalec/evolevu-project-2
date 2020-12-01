/* This program sends an HTTP GET api from the server from EvolveU class server code samples which is the rooms API (Sheldon's server sample)
 * It cycles from room 1 to room 6 continuously
*/

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
 
const char* ssid = "SSID";
const char* password = "PASSWORD";
 
void setup () {
  Serial.begin(115200);

// Print some CR/LF to get a clear lines from the garbled boot up strings
  Serial.println();
  Serial.println();

  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);            // Wifi station mode
  WiFi.begin(ssid, password);

// Try to connect the wifi
  while (WiFi.status() != WL_CONNECTED) { 
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

}

byte roomId = 1;
String urlBody = "http://10.0.1.30:3000/api/rooms/";

void incRoomId() {
  if (roomId == 6) {
    roomId = 1;
  } else {
    roomId++;
  }
}

void loop() {
  String url = urlBody + roomId;
  Serial.print("url = ");
  Serial.println(url);

  if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status
    HTTPClient http;                                  //Declare an object of class HTTPClient
    
    http.begin(url);                                  //Specify request destination
    int httpCode = http.GET();                        //Send the request
     
    if (httpCode > 0) { //Check the returning code
      String payload = http.getString();              //Get the request response payload
      Serial.println(payload);                        //Print the response payload
    }

    http.end();                                       //Close connection
  }
  incRoomId();
  delay(30000);                                       //Send a request every 30 seconds
}
