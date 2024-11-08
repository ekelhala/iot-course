from machine import I2C, Timer
from sht30 import SHT30
from bmp280 import BMP280

i2c = I2C(id=0, scl=5, sda=4)
sht = SHT30(i2c)
print("SHT30 initialized!")
bmp = BMP280(i2c)
print("BMP280 initialized")

TEMP_OUT = 'temp_out'
TEMP_IN = 'temp_in'
PRESSURE = 'pressure'
HUMIDITY = 'humidity'

sensorValues = {
    TEMP_OUT: 0,
    TEMP_IN: 0,
    PRESSURE: 0,
    HUMIDITY: 0
    }

def readSensors(timer):
    sensorValues[TEMP_OUT], sensorValues[HUMIDITY] = sht.measure()
    sensorValues[TEMP_IN] = bmp.temperature
    sensorValues[PRESSURE] = bmp.pressure

def printSensorValues(timer):
    print("Temperature out: {:.2f} C".format(sensorValues[TEMP_OUT]))
    print("Humidity: {:.2f} %".format(sensorValues[HUMIDITY]))
    print("Temperature in: {:.2f} C".format(sensorValues[TEMP_IN]))
    print("Pressure: {:.2f} Pa\n".format(sensorValues[PRESSURE]))

# read sensors every half a second
Timer().init(period=500, callback=readSensors)
# print sensor values every two seconds, could do some averaging in meantime
Timer().init(period=2000, callback=printSensorValues)
