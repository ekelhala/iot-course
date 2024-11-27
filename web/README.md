This folder contains documentation and code for the frontend and backend services which make it possible to view the weather data from the station via a webpage.

General descriptions of the services can be found below.

**backend**

A service which integrates with MongoDB and Redis cache to provide access to real-time and historical data through an API.

**frontend**

This service provides a web page which fetches and displays data from the API provided by the backend service.

**weather-collector**

weather-collector connects to HiveMQ Cloud service, and receives sensor data through MQTT topics. After receiving this data, it caches the values to Redis, and also saves them to MondoDB for later use.

An up-to-date architecture diagram of the described services is provided below.

![Services diagram](../img/services-diagram.png)
