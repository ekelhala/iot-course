from machine import I2C, Timer, Pin
from sht30 import SHT30
from bmp280 import BMP280
from umqtt.simple import MQTTClient
import network
import time
import ssl
import config # will have to import outside of git
import ntptime

# setting up wifi
ssid = config.ssid
password = config.pwd

# NOTE: use hotspotted wifi
# connecing to wifi 
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(ssid, password)

connection_timeout = 10
while connection_timeout > 0:
    if wlan.status() == 3: # connected/ip obtained
        break
    connection_timeout -= 1
    print('Waiting for Wi-Fi connection...')
    time.sleep(1)

# check if connection successful
if wlan.status() != 3: 
    raise RuntimeError('[ERROR] Failed to establish a network connection')
else:
    print('[INFO] CONNECTED SUCCESSFULLY')
    network_info = wlan.ifconfig()
    print('[INFO] IP address:', network_info[0])

# Connected, set time using ntptime
ntptime.settime()

# load the cert
# you need to include "hivemq-com-chain.der" to / in Pico
print("[INFO] reading the certificate...")
try:
    with open('hivemq-com-chain.der', 'rb') as f:
        cert = f.read()
except Exception:
    raise RuntimeError("[ERROR] reading certificate failed, are you sure you have the right file in right place?")
print("[INFO] certificate read successfully")

# we are using an older version of Pico firmware, so SSL behaves differently than in examples
# first, we construct these params with the cert and hostname
ssl_params = {'server_side':False,
              'key':None,
              'cert':None,
              'cadata':cert,
              'cert_reqs':ssl.CERT_REQUIRED,
              'server_hostname': config.MQTT_BROKER}
print("[INFO] setting connection params...")
# then we set ssl to True and set our params
client = MQTTClient(client_id=b'picow', server=config.MQTT_BROKER, port=config.MQTT_PORT,
                    user=config.MQTT_USER, password=config.MQTT_PWD, ssl=True, ssl_params=ssl_params)
client.connect()
print("[INFO] connected!")
# config sensors and i2c
i2c = I2C(id=0, scl=Pin(1), sda=Pin(0))
bmp = BMP280(i2c)
print("BMP280 initialized")
sht = SHT30(i2c)
print("SHT30 initialized")

def publish(mqtt_client, topic, value):
    mqtt_client.publish(topic, value)
    print("[INFO][PUB] Published {} to {} topic".format(value, topic))


while True:
    publish(client, 'sensors/temperature_in', str(bmp.temperature))
    pressure = (bmp.pressure / 100) # convert to hPa
    publish(client, 'sensors/pressure', str(round(pressure, 2)))
    temp_out, humidity = sht.measure()
    publish(client, 'sensors/temperature_out', str(round(temp_out, 2)))
    publish(client, 'sensors/humidity', str(round(humidity, 2)))

    # every 2s
    time.sleep(2)
