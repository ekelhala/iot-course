This folder contains documentation and code for the frontend and backend services which make it possible to view the weather data from the station via a webpage.

General descriptions of the services can be found below.

**backend**

A service which integrates with MongoDB and Redis cache to provide access to real-time and historical data through an API. To run it, you need to create a `.env`-file in the `backend`-directory with the following variables set:

| Variable | Content |
|----------|---------|
| `MONGODB_URI`| Valid login string to MongoDB Atlas database |
| `REDIS_URL` | Points to a running Redis database instance |

**frontend**

This service provides a web page which fetches and displays data from the API provided by the backend service.

**weather-collector**

weather-collector connects to HiveMQ Cloud service, and receives sensor data through MQTT topics. After receiving this data, it caches the values to Redis, and also saves them to MongoDB for later use. In order to run, this service requires a `.env`-file in its root folder (`weather-collector`), that contains the following environment variables: 

| Variable | Content |
|----------|---------|
|`MONGODB_URI`| Valid login string to MongoDB Atlas database |
| `REDIS_URL` | Points to a running Redis database instance |
| `MQTT_BROKER_URL` | URL that points to a running MQTT broker |
| `MQTT_USERNAME` | Username for the MQTT broker |
| `MQTT_PASSWORD` | Password for MQTT broker |

**weather-notifier**

`weather-notifier` is an optional extra service to which the frontend can connect to get live updates to sensor data. This service receives messages through Redis pub/sub interface when new data arrives to the collector service. It accepts and maintains WebSocket connections from clients. Whenever new data values arrive to the collector service, `weather-notifier` sends the backend API endpoint from which the new value can be queried to all of the currently connected clients. This service needs the following environment variables defined in an `.env`-file located in its root folder (`weather-notifier`):

| Variable | Content |
|----------|---------|
| `REDIS_URL` | Points to a running Redis database instance |


An up-to-date architecture diagram of the described services is provided below.

![Services diagram](../img/services-diagram.png)
