
const app = require("./index");
const config = require("./src/app/config");
const mongoose = require("mongoose");

// connect RabbitMQ

// async function connectRabbitMQ(){
//   try {
//     const amqpURI = config.amqp.uri 
//     const connection = await amqp.connect(amqpURI); 
//     const channel = await connection.createChannel();

//     const assertQueue = () => new Promise((resolve, reject) =>{
//       channel.assertQueue('email_queue', (err, ok) => {
//         if (err) {
//           reject(new Error('error declaring queue' + err.message))
//         } else {
//           resolve(ok);
//         }
//       });
//     });
//     await assertQueue();
//     return channel;
//   } catch (error) {
//     throw new Error('cannot connect to RabbitMQ', error);
//   }
// }

async function startServer() {
  try {
    // connect database
    const DB = config.db.uri;
    await mongoose.connect(DB);
    // start server
    const PORT = config.app.port;
    app.listen(PORT, (req, res) => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  } catch (error) {
    console.log("Cannot connect to the database", error);
    process.exit();
  }
}

startServer();