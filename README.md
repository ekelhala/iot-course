# Project repository for Internet of Things course

This repository contains files and source code for a weather station project done in course Internet of Things at university of Oulu.

## Contents

Listing of folders and their contents

- `/lib` - Libraries needed for Pico to run the weather station
- `src` - Micropython source code for Pico

## Configuration setup

1. Copy the `config.template.py` file to `config.py`:
   ```bash
   copy config.template.py config.py
2. Update the `config.py` to reflect your personal configurations. 

    ```plaintext
    ssid = ''  # WiFi name
    pwd = ''   # WiFi password
    MQTT_BROKER = ''  # MQTT broker URL
    MQTT_PORT = 8883  # Default MQTT port
    MQTT_USER = ''  # MQTT username
    MQTT_PWD = ''   # MQTT password
