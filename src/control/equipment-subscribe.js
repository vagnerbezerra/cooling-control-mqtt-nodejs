const sensors = require("../config/sensors-equipments.json");
var config = require("../config/config");
config.clientId = 'equipmentSubscribe';
var MQTT = require("mqtt");
var client  = MQTT.connect(config.options);

client.on("connect", onConnected);
client.on("message", onMessageReceived);

function onConnected(){
  // Inscrever cliente no topico no Broker
  console.log('Equipment Subscribers connected to Broker!\n');
  subscribeEquipments();
}

function subscribeEquipments(){
  for (let sensor of sensors){
    client.subscribe(`${config.TOPICS.equipment}/${sensor.equipment.cod}`);
  }
}

function onMessageReceived(topic, message){
  const command = JSON.parse(message.toString());
  console.log(`Topico: ${topic}`);
  const codEquipment = topic.split('/').pop();
  changeArConditioningMode(codEquipment, command);
}

function changeArConditioningMode(codEquipment, command){
  console.log(`Equipamento: ${codEquipment}`);
  console.log(`Comando: ${JSON.stringify(command)}`);

  let msgCommand = `=> RESULTADO: ${(codEquipment).toUpperCase()} `;
  if(!command.standby){
    msgCommand += `LIGADO no modo ${(command.mode).toUpperCase()}.`;
  } else{
    msgCommand += `DESLIGADO!`;
  }
  console.log(msgCommand, '\n');
}