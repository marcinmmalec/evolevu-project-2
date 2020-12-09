/*
   This is the main code for EvolveU Cohort-5 Project 2
   The code is run on an ESP-01/8266 node MCU with a BMP-280 temperature and pressure sensors through I2C serial communication
   Upon powerup, initialize the sensor then establish the wifi communication and synchronize the local time to NTP server
   The data is acquired every 60 seconds while the clock is re-synchronize every 5 minutes
   The data sent from this node MCU to the server are:
   yyyy-mm-dd hh:mm:ss tt.tt pp.ppp
   where: yyyy = year
          mm = month
          dd = day
          tt.tt = temperature in Celcius
          pp.ppp = pressure in kPa

   All data is sent as json format

   Team:  Marcin Mariuz Malec
          Wijoyo Utomo
          Koeswanto Polim
          Andrei Vedeshkin
*/

#define ARDUINO_ARCH_ESP8266

#include <TimeLib.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WiFiUdp.h>
#include <BMP280_DEV.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include </Users/utomow/Documents/Courses/EvolveU/Cohort-5/Projects/evolevu-project-2/Microcontroller/SSID.h>

#define DEBUG
#define SERIAL_SPEED  115200
#define I2C_SPEED     200000

#define UTC_TZ        0
#define MST_TZ        -7

#define NTP_SERVER_POOL "us.pool.ntp.org"
#define UDP_PORT      8888

class SensorData {
  private:
    time_t tm;
    unsigned int id;
    float temperature;
    float pressure;
    float altitude;
    bool  newData;
  public:
    SensorData(unsigned int id) {   // constructor of SensorData class
      this->id = id;
      newData = false;
    }

    void setTime(time_t tm) {       // method for setting data
      this->tm = tm;
    }

    void setTemperature(float temp) {   // method for setting temperature
      this->temperature = temp;
    }

    void setPressure(float pres) {  // method for setting pressure
      this->pressure = pres;
    }

    void setAltitude(float alt) {   // method for setting altitude
      this->altitude = alt;
    }

    String formatNumber(uint8_t number) {   // helper function to format date and time format by padding with zero
      if (number < 10)
        return ("0" + String(number));
      else
        return String(number);
    }

    String formatId(unsigned int Id) {    // helper function to format id by padding with zero (4 digit number)
      if (Id < 10)
        return ("000" + String(Id));
      else if (Id < 100)
        return ("00"+ String(Id));
      else if (Id < 1000)
        return ("0" + String(Id));
      else
        return (String(Id));
    }

    StaticJsonDocument<256> convertToJson() { // convert sensor date and time data into JSON
      StaticJsonDocument<256> doc;
      doc["id"] = formatId(id);
      doc["time"] = String(year(tm)) + "-" + formatNumber(month(tm)) + "-" + formatNumber(day(tm)) + "T" + formatNumber(hour(tm)) + ":" + formatNumber(minute(tm)) + ":" + formatNumber(second(tm)) +"Z";
      doc["temperature"] = String(temperature, 2);
      doc["pressure"] = String(pressure, 4);
      return doc;
    }

    void printDataInJson() {      // printing the formatted data in JSON, used for trouble shooting
      Serial.print("Data package in JSON : ");
      serializeJson(convertToJson(), Serial);
      Serial.println();
    }

    void postData(char* URL) {    // function for performing HTTP POST to the server
      HTTPClient http;
      http.begin(URL);
      http.addHeader("Content-Type", "application/json");
      String stringJSON;
      serializeJson(convertToJson(), stringJSON);
      int httpCode = http.POST(stringJSON);
      String payload = http.getString();
      http.end(); 
    }
    
};

class LoopTimer {
  private:
    unsigned int period;
    time_t beginWait;
    bool timerOn = false;
  public:
    LoopTimer(unsigned int period) {
      this->period = period;
      beginWait = now();
    }

    bool start() {
      beginWait = now();
      timerOn = true;
    }

    bool stop() {
      beginWait = 0;
      timerOn = false;
    }

    /*
       check if timer is up, returns true when it is and false if otherwise
    */
    bool isTimerUp() {
      if (timerOn) {
        if (now() >= beginWait + period) {
          beginWait += period;
          return true;
        } else
          return false;
      }
    }
};

// Global variables and objects
LoopTimer timer1Second(1);      // creating loop timer object for 1 second period
LoopTimer timer1Minute(60);     // creating loop timer object for 1 minute period

SensorData sensorData(1);       // creating sensor data object to handle sensor data formatting, printing (for checking) and posting to server


WiFiUDP Udp;                    // Udp object to handle UDP data handling (NTP network communicates in UDP instead of TCP)
unsigned int localPort = UDP_PORT;  // local port to listen for UDP packets

static const char ntpServerName[] = NTP_SERVER_POOL;  //NTP server pools

const int NTP_PACKET_SIZE = 48; // NTP time is in the first 48 bytes of message
byte packetBuffer[NTP_PACKET_SIZE]; //buffer to hold incoming & outgoing packets

ESP8266WiFiMulti wifiMulti;
int wifiStatus = WL_DISCONNECTED;

BMP280_DEV bmp280(0, 2);                          // Instantiate (create) a BMP280 object and set-up for I2C operation on pins SDA: 0, SCL: 2
float temperature, pressure, altitude;            // Temporary variables to hold the sensor measurements

String  server = "http://10.0.1.30:3000/post/node/data";

// Function prototypes
// Serial commnunication functions
void initSerial();

// Wifi connections functions
void initWiFi();
void connectToWiFi();
void getWiFiStatus();
boolean isWiFiConnected();

// Time server related functions
void initNTP();
time_t getNtpTime();
void sendNTPpacket(IPAddress &address);

// BMP280 sensor functions
void initBMP280();


void setup() {
  initSerial();
  initWiFi();
  initNTP();
  initBMP280();
  timer1Second.start();
  timer1Minute.start();
}


void loop() {
  if (timeStatus() != timeNotSet) {

    if (timer1Second.isTimerUp()) {
      if (!isWiFiConnected())
        connectToWiFi();
    }

    if (timer1Minute.isTimerUp()) {
      bmp280.startForcedConversion();
      sensorData.setTime(now());
    }

    if (bmp280.getMeasurements(temperature, pressure, altitude)) {
      sensorData.setTemperature(temperature);
      sensorData.setPressure(pressure/10);
      sensorData.setAltitude(altitude);
      sensorData.printDataInJson();
      sensorData.postData("http://10.0.1.14:3000/postdata");
    }
  }
}

// Serial functions
void initSerial() {
  Serial.begin(SERIAL_SPEED);
#ifdef  DEBUG
  Serial.println();
  Serial.println();
  Serial.println("Initialize serial commnunication");
#endif
}

// WiFi connection functions
void initWiFi() {
#ifdef  DEBUG
  Serial.println("Initialize WiFi");
#endif
  WiFi.mode(WIFI_STA);
  wifiMulti.addAP(SSID1, PASSWORD1);
  wifiMulti.addAP(SSID2, PASSWORD2);
  wifiMulti.addAP(SSID3, PASSWORD3);

  while (!isWiFiConnected()) {
    connectToWiFi();
    delay(500);
  }
}

void connectToWiFi() {
#ifdef  DEBUG
  //  Serial.println("Connecting Wifi...");
  if (wifiMulti.run() != WL_CONNECTED)
    Serial.print(".");
  else {
    Serial.println();
    Serial.print("Wifi connected to ");
    Serial.println(WiFi.SSID());
    Serial.print("IP address ");
    Serial.println(WiFi.localIP());
  }
#else
  wifiMulti.run();
#endif
}

boolean isWiFiConnected() {
  return (WiFi.status() == WL_CONNECTED);
}

// NTP functions
void initNTP() {
  Udp.begin(UDP_PORT);
  Serial.print("Local port: ");
  Serial.println(Udp.localPort());
  Serial.println("waiting for sync");
  setSyncProvider(getNtpTime);
  setSyncInterval(300);
}

time_t getNtpTime()
{
  IPAddress ntpServerIP; // NTP server's ip address

  while (Udp.parsePacket() > 0) ;                   // discard any previously received packets, flush the buffer
  WiFi.hostByName(ntpServerName, ntpServerIP);      // getting a random server from the pool and get the IP address of the given server name
  sendNTPpacket(ntpServerIP);                       // send NTP time request
  uint32_t beginWait = millis();
  while (millis() - beginWait < 1500) {             // wait the response for 1.5s. This is a blocking process, not ideal
    int size = Udp.parsePacket();                   // check the incoming buffer for response from NTP server
    if (size >= NTP_PACKET_SIZE) {
      Udp.read(packetBuffer, NTP_PACKET_SIZE);      // read packet into the buffer
      unsigned long secsSince1900;
      // convert four bytes starting at location 40 to a long integer
      secsSince1900 =  (unsigned long)packetBuffer[40] << 24;
      secsSince1900 |= (unsigned long)packetBuffer[41] << 16;
      secsSince1900 |= (unsigned long)packetBuffer[42] << 8;
      secsSince1900 |= (unsigned long)packetBuffer[43];
      return secsSince1900 - 2208988800UL + UTC_TZ * SECS_PER_HOUR;
    }
  }
  return 0;                                         // return 0 if unable to get the time
}

void sendNTPpacket(IPAddress &address)
{
  // set all bytes in the buffer to 0
  memset(packetBuffer, 0, NTP_PACKET_SIZE);
  // Initialize values needed to form NTP request
  // (see URL above for details on the packets)
  packetBuffer[0] = 0b11100011;   // LI, Version, Mode
  packetBuffer[1] = 0;     // Stratum, or type of clock
  packetBuffer[2] = 6;     // Polling Interval
  packetBuffer[3] = 0xEC;  // Peer Clock Precision
  // 8 bytes of zero for Root Delay & Root Dispersion
  packetBuffer[12] = 49;
  packetBuffer[13] = 0x4E;
  packetBuffer[14] = 49;
  packetBuffer[15] = 52;
  // all NTP fields have been given values, now
  // you can send a packet requesting a timestamp:
  Udp.beginPacket(address, 123); //NTP requests are to port 123
  Udp.write(packetBuffer, NTP_PACKET_SIZE);
  Udp.endPacket();
}

// BMP280  sensor functions
void initBMP280() {
  bmp280.begin(BMP280_I2C_ALT_ADDR);              // Default initialisation with alternative I2C address (0x76), place the BMP280 into SLEEP_MODE
  bmp280.setClock(I2C_SPEED);
}
