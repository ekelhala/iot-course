import { configDotenv } from "dotenv";
configDotenv();
import mqtt from "mqtt";
import { createClient } from "@redis/client";

const mqttTopics:string[] = []

const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL, {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
});

const redisClient = await createClient({url: process.env.REDIS_URL}).connect();

// MQTT handlers
mqttClient.on('message', async (topic:string, message:Buffer, packet: mqtt.IPublishPacket) => {
    // caching the value once received
    await redisClient.set(topic, message.toString());
});

// subscribing to given topics once connected
mqttClient.on('connect', () => {
    mqttClient.subscribe(mqttTopics);
})
