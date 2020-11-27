/*
 * This is the main code for EvolveU Cohort-5 Project 2
 * The code is run on an ESP-01/8266 node MCU with a BMP-280 temperature and pressure sensors through I2C serial communication
 * Upon powerup, initialize the sensor then establish the wifi communication and synchronize the local time to NTP server
 * The data is acquired every 60 seconds while the clock is re-synchronize every 5 minutes
 * The data sent from this node MCU to the server are:
 * yyyy-mm-dd hh:mm:ss tt.tt pp.ppp
 * where: yyyy = year
 *        mm = month
 *        dd = day
 *        tt.tt = temperature in Celcius
 *        pp.ppp = pressure in kPa
 *        
 * All data is sent as json format
 * 
 * Team:  Marcin Mariuz Malec
 *        Wijoyo Utomo
 *        Koeswanto Polim
 *        Andrei
 */

#include <TimeLib.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WiFiUdp.h>
#include <BMP280_DEV.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

#define DEBUG
#define SERIAL_SPEED  115200
#define I2C_SPEED     200000

class SensorData {
  private:
    uint8_t ddate;
    uint8_t ttime;
    float temperature;
    float pressure;
    float altitude;
    bool  newData;
  public:
    bool isNewData() {
      return newData;
    }

    void  setDate(uint8_t date) {
      this->ddate = date;
    }

    void setTime(uint8_t time) {
      this->ttime = time;
    }

    void setTemperature(float temp) {
      this->temperature = temp;
    }

    void setPressure(float pres) {
      this->pressure = pres;
    }

    void setAltitude(float alt) {
      this->altitude = alt;
    }

    bool postDataHttp() {
      
    }

    
};

class LoopTimer {
  private:
    unsigned int period;
    time_t beginWait;
    bool timerStart = false;
  public:
    LoopTimer(unsigned int period) {
        this->period = period;
        beginWait = now();
    }

    bool start() {
      beginWait = now();
      timerStart = true;
    }

    bool stop() {
      beginWait = 0;
      timerStart = false;
    }

/*
 * check if timer is up, returns true when it is and false if otherwise
 */
    bool isTimerUp() {
      if (timerStart) {
        if (now() >= beginWait + period) {
          beginWait += period;
          return true;
        } else
          return false;
      }
    }
};

// Global variables and objects
LoopTimer timer1Second(1);
LoopTimer timer1Minute(60);


WiFiUDP Udp;
unsigned int localPort = 8888;  // local port to listen for UDP packets

static const char ntpServerName[] = "us.pool.ntp.org";
const int timeZone = -7;  // Pacific Daylight Time (USA)

const int NTP_PACKET_SIZE = 48; // NTP time is in the first 48 bytes of message
byte packetBuffer[NTP_PACKET_SIZE]; //buffer to hold incoming & outgoing packets


#define SSID1       "Inception"
#define PASSWORD1   "5XE4w%ug5!PvHwyb"

#define SSID2       "2 Monkeys and Dragon"
#define PASSWORD2   "Sapim3nd3m"

#define SSID3       "TELUS2340"
#define PASSWORD3   "f99f664c77"

ESP8266WiFiMulti wifiMulti;
int wifiStatus = WL_DISCONNECTED;

BMP280_DEV bmp280(0, 2);                          // Instantiate (create) a BMP280 object and set-up for I2C operation on pins SDA: 6, SCL: 7
float temperature, pressure, altitude;


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


// Http client functions
boolean httpPost(char* request, char* response, char* message);
boolean httpGet(char* request, char* response);

void setup() {
  // put your setup code here, to run once:
  initSerial();
  initWiFi();
  initNTP();
  initBMP280();
  timer1Second.start();
  timer1Minute.start();
}


void loop() {
//  Serial.println(now());
//  delay(1000);
//  Serial.println(now());
//  while (true) ;
  // put your main code here, to run repeatedly:
  if (timeStatus() != timeNotSet) {

    if (timer1Second.isTimerUp()) {
      
      if (!isWiFiConnected())
        connectToWiFi();

//      Serial.println("This is 1 second timer loop.");
    }
  
    if (timer1Minute.isTimerUp()) {
      bmp280.startForcedConversion();
//      Serial.println("This is 1 minute timer loop.");
    }
  
    if (bmp280.getMeasurements(temperature, pressure, altitude)) {
      Serial.print(hour());
      Serial.print(":");
      Serial.print(minute());
      Serial.print(":");
      Serial.print(second());
      Serial.print("  ");
      Serial.print(temperature);
      Serial.print("*C  ");
      Serial.print(pressure/10, 3);
      Serial.print("kPa ");
      Serial.print(altitude);
      Serial.println("m");
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
  Udp.begin(localPort);
  Serial.print("Local port: ");
  Serial.println(Udp.localPort());
  Serial.println("waiting for sync");
  setSyncProvider(getNtpTime);
  setSyncInterval(300);
}

time_t getNtpTime()
{
  IPAddress ntpServerIP; // NTP server's ip address

  while (Udp.parsePacket() > 0) ; // discard any previously received packets
  Serial.println("Transmit NTP Request");
  // get a random server from the pool
  WiFi.hostByName(ntpServerName, ntpServerIP);
  Serial.print(ntpServerName);
  Serial.print(": ");
  Serial.println(ntpServerIP);
  sendNTPpacket(ntpServerIP);
  uint32_t beginWait = millis();
  while (millis() - beginWait < 1500) {
    int size = Udp.parsePacket();
    if (size >= NTP_PACKET_SIZE) {
      Serial.println("Receive NTP Response");
      Udp.read(packetBuffer, NTP_PACKET_SIZE);  // read packet into the buffer
      unsigned long secsSince1900;
      // convert four bytes starting at location 40 to a long integer
      secsSince1900 =  (unsigned long)packetBuffer[40] << 24;
      secsSince1900 |= (unsigned long)packetBuffer[41] << 16;
      secsSince1900 |= (unsigned long)packetBuffer[42] << 8;
      secsSince1900 |= (unsigned long)packetBuffer[43];
      return secsSince1900 - 2208988800UL + timeZone * SECS_PER_HOUR;
    }
  }
  Serial.println("No NTP Response :-(");
  return 0; // return 0 if unable to get the time
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
//  bmp280.setTimeStandby(TIME_STANDBY_2000MS);     // Set the standby time to 2 seconds
}
