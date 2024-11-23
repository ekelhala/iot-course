# weather-collector

This service acts as a connector between the MQTT broker and MongoDB. It subscribes to topics that deliver sensor data from the weather station, and saves the received values to the database. The latest values from the broker are also cached to Redis, from which they can be easily queried.
