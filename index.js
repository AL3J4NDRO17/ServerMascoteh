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

/* USUARIOS.
.
.
.
. */
app.post('/GetUser', async (req, res) => {
  console.log("sientre");
  const { username, password } = req.body;
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
      Dispositivo: {
          // Aquí van los datos del dispositivo embebido
          // Por ejemplo:
          ID: null,
          // Otros campos del dispositivo...
      },
      permisos: "usuario"
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
app.get('/usuarios', async (req, res) => {
  console.log("entrepareverusaurios");
  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("Users");

    // Realizar la consulta a la colección de usuarios
    const usuarios = await collection.find({}).toArray();

    // Cerrar la conexión
    client.close();
    console.log("Conexión cerrada");

    // Responder con los resultados de la consulta
    res.json(usuarios);
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
});
app.delete('/delete/:id', async (req, res) => {
  const userId = req.params.id; // Obtener el ID del usuario a eliminar desde los parámetros de la solicitud
  console.log(userId);
  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("Users");

    // Realizar la eliminación del usuario en la colección
    const result = await collection.deleteOne({ _id: new ObjectId(userId) });  // Suponiendo que el ID del usuario sea único

    // Verificar si se eliminó el usuario correctamente
    if (result.deletedCount === 1) {
      console.log("Usuario eliminado correctamente.");
      res.status(200).send("Usuario eliminado correctamente.");
    } else {
      console.log("El usuario no pudo ser encontrado o eliminado.");
      res.status(404).send("El usuario no pudo ser encontrado o eliminado.");
    }

    // Cerrar la conexión
    client.close();
    console.log("Conexión cerrada");
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
});

app.put('/editar/:id', async (req, res) => {
  const userId = req.params.id; // Obtener el ID del usuario a editar desde los parámetros de la solicitud
  const userData = req.body; // Obtener los datos del usuario a editar desde el cuerpo de la solicitud
  console.log(userId);
  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("Users");

    // Realizar la actualización del usuario en la colección
    const result = await collection.updateOne({ _id: new ObjectId(userId) }, { $set: userData });

    // Verificar si se actualizó el usuario correctamente
    if (result.modifiedCount === 1) {
      console.log("Usuario actualizado correctamente.");
      res.status(200).send("Usuario actualizado correctamente.");
    } else {
      console.log("El usuario no pudo ser encontrado o actualizado.");
      res.status(404).send("El usuario no pudo ser encontrado o actualizado.");
    }

    // Cerrar la conexión
    client.close();
    console.log("Conexión cerrada");
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
});

/* PRODUCTOS............
.
..
.
.
.
 */
app.get('/productos', async (req, res) => {
  try {
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("Products");

    // Realizar la consulta a la colección de usuarios
    const producto = await collection.find({}).toArray();

    // Cerrar la conexión
    client.close();
    console.log("Conexión cerrada");

    // Responder con los resultados de la consulta
    res.json(producto);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error al obtener productos");
  }
});

// Agregar un nuevo producto
app.post('/InsertProduct', async (req, res) => {
  
  const data = req.body;
  console.log(data);
  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("Products");

    // Verificar si el email ya existe en la colección
    // Insertar los datos en la colección
    await collection.insertOne({...data}); // Establecer permisos de usuario automáticamente

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

// Actualizar un producto existente
app.put('/productosedit/:id', async (req, res) => {
  const productId = req.params.id; // Obtener el ID del usuario a editar desde los parámetros de la solicitud
  const productData = req.body; // Obtener los datos del usuario a editar desde el cuerpo de la solicitud
  console.log(productId);
  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("Products");

    // Realizar la actualización del usuario en la colección
    const result = await collection.updateOne({ _id: new ObjectId(productId) }, { $set: productData });

    // Verificar si se actualizó el usuario correctamente
    if (result.modifiedCount === 1) {
      console.log("Usuario actualizado correctamente.");
      res.status(200).send("Usuario actualizado correctamente.");
    } else {
      console.log("El usuario no pudo ser encontrado o actualizado.");
      res.status(404).send("El usuario no pudo ser encontrado o actualizado.");
    }

    // Cerrar la conexión
    client.close();
    console.log("Conexión cerrada");
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
});

// Eliminar un producto
app.delete('/productos/:id', async (req, res) => {
  const productId = req.params.id; // Obtener el ID del usuario a eliminar desde los parámetros de la solicitud
  console.log(productId);
  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("Products");

    // Realizar la eliminación del usuario en la colección
    const result = await collection.deleteOne({ _id: new ObjectId(productId) });  // Suponiendo que el ID del usuario sea único

    // Verificar si se eliminó el usuario correctamente
    if (result.deletedCount === 1) {
      console.log("Producto eliminado correctamente.");
      res.status(200).send("Producto eliminado correctamente.");
    } else {
      console.log("El Producto no pudo ser encontrado o eliminado.");
      res.status(404).send("El Producto no pudo ser encontrado o eliminado.");
    }

    // Cerrar la conexión
    client.close();
    console.log("Conexión cerrada");
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


