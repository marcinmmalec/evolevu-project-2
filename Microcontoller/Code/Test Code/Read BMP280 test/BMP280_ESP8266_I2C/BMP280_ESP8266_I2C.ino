//////////////////////////////////////////////////////////////////////////////////////////////////////////
// BMP280_DEV - ESP8266, I2C Communications, Default Configuration, Normal Conversion, User-Defined Pins
//////////////////////////////////////////////////////////////////////////////////////////////////////////

#include <BMP280_DEV.h>                           // Include the BMP280_DEV.h library

float temperature, pressure, altitude;            // Create the temperature, pressure and altitude variables
BMP280_DEV bmp280(0, 2);                          // Instantiate (create) a BMP280 object and set-up for I2C operation on pins SDA: 6, SCL: 7

void setup() 
{
  Serial.begin(115200);                           // Initialise the serial port
  Serial.println();
  Serial.println();
  bmp280.begin(BMP280_I2C_ALT_ADDR);              // Default initialisation with alternative I2C address (0x76), place the BMP280 into SLEEP_MODE 
//  bmp280.setTimeStandby(TIME_STANDBY_2000MS);     // Set the standby time to 2 seconds
//  bmp280.startNormalConversion();                 // Start BMP280 continuous conversion in NORMAL_MODE
}

void loop() 
{
  bmp280.startForcedConversion();
  if (bmp280.getMeasurements(temperature, pressure, altitude))    // Check if the measurement is complete
  {
    Serial.print(temperature);                    // Display the results    
    Serial.print(F("*C   "));
    Serial.print(pressure/10, 3);    
    Serial.print(F("kPa   "));
    Serial.print(altitude);
    Serial.println(F("m"));  
  }
}
