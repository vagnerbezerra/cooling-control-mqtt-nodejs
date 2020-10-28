const sensors = require("../config/sensors-equipments.json");
var config = require("../config/config");
config.clientId = 'coolingControl';
var MQTT = require("mqtt");
var client  = MQTT.connect(config.options);

client.on("connect", onConnected);
client.on("message", onMessageReceived);

function onConnected(){
  // Inscrever cliente no topico no Broker
  console.log('Cooling Control Subscriber/Publisher connected to Broker!\n');
  client.subscribe(`${config.TOPICS.sensor}/+`);
}

function onMessageReceived(topic, message){
  const dataSensor = JSON.parse(message.toString());
  console.log(`Topico: ${topic}`)
  console.log(`Sensor: ${dataSensor.cod}`)
  console.log(`    Temperatura: ${dataSensor.temperature}°C`);
  console.log(`    Umidade Relativa: ${dataSensor.humidity}%`);
  airConditioningControl(dataSensor);
}

function airConditioningControl(dataSensor){
  const equipment = sensors.find((sensor) => sensor.cod == dataSensor.cod).equipment;
  let command, msg = '';
  if(dataSensor.temperature >=  18 && dataSensor.temperature <=  27){
    // Desligar a função COOL e testar a umidade (caso necessário, ligar a função DRY)
    if(dataSensor.humidity > 55){
      msg += `Comando: => Ligar o ${equipment.name} (${equipment.cod}) no modo DRY.`;
      command = { mode: 'dry' };
    } else {
      msg += `Comando: => Desligar o ${equipment.name} (${equipment.cod}).`;
      command = { standby: true };
    }
  } else if(dataSensor.temperature < 18){
    // Ligar a função HEAT do ar condicionado para elevar a temperatura
    msg += `Comando: => Ligar o ${equipment.name} (${equipment.cod}) no modo HEAT`;
    command = { mode: 'heat' };
  } else {
    // Ligar a função COOL para baixar a temperatura
    msg += `Comando: => Ligar o ${equipment.name} (${equipment.cod}) no modo COOL`;
    command = { mode: 'cool', standby: false };
  }
  client.publish(`${config.TOPICS.equipment}/${equipment.cod}`, JSON.stringify(command));
  console.log(`${msg}\n`);
}

