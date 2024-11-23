# Backend for IoT course

You need NodeJS and `npm` installed in your system in order to run this program.

Pull in dependencies by running `npm install`. After this operation is completed, the server can be started by running `npm start`. The server binds to port `8000` by default, this can be changed by setting the environment variable `PORT`.

To start the server in development mode, use `npm run dev`

## API structure

The endpoints and data delivered by them are defined in this section.

API is divided into two main endpoint sections: `sensors` and `history`. `sensors` provides always the latest values received from the MQTT broker. By using the endpoints under `history`, you can query historical information from the different sensors.

All endpoints are queried with `GET`, unless otherwise noted. They return responses in JSON format.

### `/sensors`

#### `/sensors/temperature_in`

The latest temperature value from the indoor temperature sensor, BMP-280 in degrees Celsius.

#### `/sensors/temperature_out`

The latest temperature value from the outdoor temperature sensor, SHT-30-D in degrees Celsius.

#### `/sensors/humidity`

The latest humidity value from the outdoor humidity sensor SHT-30-D. Unit is percent.

#### `/sensors/pressure`

The latest air pressure measurement from the BMP-280 in hPa.

#### `/sensors/all`

Returns all of the latest values (temperature in, temperature out, humidity and pressure)
