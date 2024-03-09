const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const mqtt = require('mqtt'); // Importar el módulo MQTT


const app = express();
const port = 3000;

// Configurar middleware para analizar el cuerpo de las solicitudes HTTP
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// URL de conexión a tu base de datos MongoDB Atlas
const mongoUrl = "mongodb+srv://pixon:Filo1234@cluster0.sw8tbcs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const mqttClient = mqtt.connect('mqtt://broker.emqx.io');
// Ruta para recibir datos desde la ESP32
const { ObjectId } = require('mongodb');

app.post('/app/application-0-laqjr/endpoint/SensorData', async (req, res) => {
  const data = req.body;
  console.log(data);
  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("DeviceState");

    // Crear un objeto ObjectId a partir del ID proporcionado
    const objectId = new ObjectId("65eab39b61ff359e597d8a39");

    // Buscar el documento por su _id
    const existingDocument = await collection.findOne({ _id: objectId });
    if (!existingDocument) {
      console.error("Documento no encontrado en la base de datos");
      return res.status(404).send("Documento no encontrado en la base de datos");
    }

    // Actualizar el documento
    await collection.updateOne({ _id: objectId }, { $set: data });
    console.log("Documento actualizado en la base de datos");

    // Cerrar la conexión
    client.close();
    console.log("Conexión cerrada");

    // Responder con un mensaje de confirmación
    res.send("Datos recibidos y guardados en la base de datos");
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
});


app.post('/GetUser', async (req, res) => {
  console.log("sientre");
  const { username , password } = req.body;
  console.log(username);
  console.log(password);
  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("Users");

    // Verificar si el usuario existe en la colección
    const existingUser = await collection.findOne({ user: username, pass: password });
    if (existingUser) {
      console.log("Usuario Encontrado:", existingUser);
      // Respondemos con el usuario encontrado
      res.status(200).json(existingUser);
      return; // Terminar la ejecución de la función
    }

    // Si no se encuentra ningún usuario, respondemos con un mensaje indicando que no existe
    console.log("Usuario no encontrado");
    res.status(404).send("Usuario no encontrado");

  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
});



app.post('/Insert', async (req, res) => {
  const data = req.body;

  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("Users");

    // Verificar si el email ya existe en la colección
    const existingUser = await collection.findOne({ user: data.user });
    if (existingUser) {
      console.log("El email ya existe en la base de datos");
      // Responder con un mensaje de error
      res.status(400).send("El email ya existe en la base de datos");
      return; // Terminar la ejecución de la función
    }

    // Insertar los datos en la colección
    await collection.insertOne({
      ...data,
      permisos: "usuario" // Establecer permisos de usuario automáticamente
    });
    console.log("Datos insertados en la base de datos");

    // Cerrar la conexión
    client.close();
    console.log("Conexión cerrada");

    // Responder a la ESP32 con un mensaje de confirmación
    res.send("Datos recibidos y guardados en la base de datos");
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
});
function enviarMensaje(estado) {
  const message = estado === "ON" ? "ON" : estado === "MOVE" ? "MOVE" : "OFF"; // Si estado es "ON" entonces enviar "ON", si es "MOVE" entonces enviar "MOVE", de lo contrario enviar "OFF"
  mqttClient.publish('PIXON', message);
  console.log(`Mensaje MQTT enviado: ${message}`);
}

app.get('/app/data-afnpg/endpoint/EcoNido', (req, res) => {
  const { estado } = req.query; // Use req.query to get parameters from the URL

  if (!estado || (estado !== "ON" && estado !== "OFF" && estado !== "MOVE")) {
    return res.status(400).send('Invalid or missing estado value');
  }

  enviarMensaje(estado);

  res.status(200).send(`Datos ${estado === "ON" ? 'Encendido' : 'Apagado'} recibidos y procesados`);
});


// Manejador de ruta para la ruta /enviar

app.post('/app/data-afnpg/endpoint/EcoNido', async (req, res) => {
  const { estado } = req.body;

  if (estado !== "ON" && estado !== "OFF" && estado !== "MOVE") {
    return res.status(400).send('Invalid estado value');
  }

  enviarMensaje(estado);

  res.status(200).send(`Datos ${estado === "ON" ? 'Encendido' : estado === "OFF" ? 'Apagado' : 'Movido'} recibidos y procesados`);
});



// Manejar errores 404 para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).send("Ruta no encontrada");
});

// Manejar errores 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error del servidor');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Node.js escuchando en http://localhost:${port}`);
});


