const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3030 });

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    if(message){
      let order = JSON.parse(message);
      order.added = true;
      order.type = "_RECIEVED_"
      ws.send(JSON.stringify(order));
      wss.broadcast(JSON.stringify(order));
    }
  });

  ws.send(JSON.stringify({type:"_MESSAGE_",message:"Welcome to the bar"}));
  ws.on('error', () => console.log('error'));
});

wss.on('close', function(){
  console.log('Closing connection');
});



