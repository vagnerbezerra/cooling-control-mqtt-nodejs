const options = {
    port: 1883,
    host: '127.0.0.1',
    protocol: 'mqtt',
    username: undefined,
    password: undefined,
    reconnectPeriod: 10000
};

const TOPICS = {
    sensor: 'temp-sensor',
    equipment: 'equipment-control'
}

exports.options = options;
exports.TOPICS = TOPICS;