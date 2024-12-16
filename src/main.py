from machine import I2C, Timer, Pin
#from sht30 import SHT30
from bmp280 import BMP280
from umqtt.simple import MQTTClient
import network
import time
import ssl
import config # will have to import outside of git

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

context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
context.verify_mode = ssl.CERT_NONE # NOTE: change to CERT_REQUIRED for cert verification

client = MQTTClient(client_id=b'sane_picow', server=config.MQTT_BROKER, port=config.MQTT_PORT,
                    user=config.MQTT_USER, password=config.MQTT_PWD, ssl=context)
client.connect()

# TODO: Add SHT30 configs
# config sensors and i2c
i2c = I2C(id=0, scl=Pin(1), sda=Pin(0))
bmp = BMP280(i2c)
print("BMP280 initialized")
#sht = SHT30(i2c)
#print("SHT30 initialized")

def publish(mqtt_client, topic, value):
    mqtt_client.publish(topic, value)
    print("[INFO][PUB] Published {} to {} topic".format(value, topic))


while True:
    publish(client, 'sane_picow/temperature_in', str(bmp.temperature))
    publish(client, 'sane_picow/pressure', str(bmp.pressure))
    #publish(client, 'sane_picow/temperature_out', str()) # for sht30
    #publish(client, 'sane_picow/humidity', str()) # for sht30

    # every 2s
    time.sleep(2)
    