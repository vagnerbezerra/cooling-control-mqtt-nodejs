const sensors = require("../config/sensors-equipments.json");
var config = require("../config/config");
config.clientId = 'sensorPublish';
var MQTT = require("mqtt");
var client  = MQTT.connect(config.options);
var moment = require('moment-timezone');

client.on("connect", () => {
  console.log('Sensor Publishers (Temperature/Humidity) connected to Broker!\n');
  publishDataSensors();
});

function generateDataSensor(sensor){
  const formattedTime = moment()
        .tz("America/Campo_Grande")
        .format('YYYY-MM-DD HH:mm:ss');

  function between(min, max) {  
    return Math.floor(
      Math.random() * (max - min) + min
    )
  }

  return {
    cod: sensor.cod,
    humidity: between(17, 30),
    temperature: between(32, 60),
    time: formattedTime
  }
}

function publishDataSensors(){
  for (let sensor of sensors){
    // Agendar a publicacao dos dados dos sensores
    setInterval(() => {
      // Obter dados dos sensor e publicar no topico no Broker
      const sensorData = generateDataSensor(sensor);
      console.log(sensorData);
      client.publish(`${config.TOPICS.sensor}/${sensorData.cod}`, JSON.stringify(sensorData));
    }, sensor.updatetime);
  }
}