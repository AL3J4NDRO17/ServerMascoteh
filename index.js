  const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const cors = require('cors');
const mqtt = require('mqtt'); // Importar el módulo MQTT}


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
app.post('/InsertHistoric', async (req, res) => {
  const data = req.body;

  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("DeviceHistoric");

    // Obtener la fecha y la hora actuales
    const fechaActual = new Date();
    
    // Obtener la fecha en formato AAAA-MM-DD
    const fecha = fechaActual.toISOString().split('T')[0];
 
    // Obtener la hora en formato HH:MM:SS
    const hora = fechaActual.toTimeString().split(' ')[0];

    // Determinar el tipo de acción
    let accionRealizada = "";
    if (data === "move") {
      accionRealizada = "Alimento Dispensado";
    } else if (data === "On") {
      accionRealizada = "Agua Dispensada";
    } else {
      accionRealizada = "Otra acción"; // Puedes agregar un caso por defecto si lo necesitas
    }

    // Insertar los datos en la colección
    await collection.insertOne({
      Accion: accionRealizada,
      Hora: hora,
      Fecha: fecha,
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

app.post('/InsertHistoric', async (req, res) => {
  const data = req.body;

  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("DeviceHistoric");

    // Verificar si el email ya existe en la colección
     // Obtener la fecha y la hora actuales
     const fechaActual = new Date();
    
     // Obtener la fecha en formato AAAA-MM-DD
     const fecha = fechaActual.toISOString().split('T')[0];
 
     // Obtener la hora en formato HH:MM:SS
     const hora = fechaActual.toTimeString().split(' ')[0];

    // Insertar los datos en la colección
    await collection.insertOne({

      Accion: data,
      Hora: hora,
      Fecha: fecha,

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
/* USUARIOS.
.
.
.
. */
app.post('/GetDispobyId', async (req, res) => {
  console.log("sientre");
  const { username: id } = req.body;
  console.log(id);

  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("Users");

    // Verificar si el usuario existe en la colección
    const existingUser = await collection.findOne({ user: id, pass: password });
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
      Direccion: {
        Estado: null,
        Calle: null,
        Cp: null,
        N_Casa: null,
        Referencias: null

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
    await collection.insertOne({ ...data }); // Establecer permisos de usuario automáticamente

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

app.get('/getDetails/:id', async (req, res) => {
  const productId = req.params.id; // Obtener el ID del usuario a editar desde los parámetros de la solicitud
  // Obtener los datos del usuario a editar desde el cuerpo de la solicitud
  console.log(productId);
  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("Products");

    // Realizar la actualización del usuario en la colección
    const result = await collection.findOne({ _id: new ObjectId(productId) });
    // Verificar si se actualizó el usuario correctamente
    console.log(result);
    console.log("Producto encontrado correctamente.");
    res.json(result);

    // Cerrar la conexión
    client.close();
    console.log("Conexión cerrada");

    // Responder con los resultados de la consulta




  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
});





// Manejador de ruta para la ruta /enviar

/* ESP32





*/
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
app.get('/getDispositivo', async (req, res) => {
  const dispositivoId = "65eab39b61ff359e597d8a39"; // Obtener el ID del usuario a editar desde los parámetros de la solicitud
  // Obtener los datos del usuario a editar desde el cuerpo de la solicitud
  console.log(dispositivoId);
  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("DeviceState");

    // Realizar la actualización del usuario en la colección
    const result = await collection.findOne({ _id: new ObjectId(dispositivoId) });
    // Verificar si se actualizó el usuario correctamente
    console.log(result);
    console.log("Producto encontrado correctamente.");
    res.json(result);

    // Cerrar la conexión
    client.close();
    console.log("Conexión cerrada");

    // Responder con los resultados de la consulta




  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
});

app.post('/app/data-afnpg/endpoint/EcoNido', async (req, res) => {
  const { estado } = req.body;

  if (estado !== "ON" && estado !== "OFF" && estado !== "MOVE") {
    return res.status(400).send('Invalid estado value');
  }

  enviarMensaje(estado);

  res.status(200).send(`Datos ${estado === "ON" ? 'Encendido' : 'Apagado'} recibidos y procesados`);

});


/* Quienes Somos */
app.get('/getQn', async (req, res) => {

  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("QuienesSomos");

    // Realizar la consulta a la colección de usuarios
    const Qns = await collection.find({}).toArray();

    // Cerrar la conexión
    client.close();
    console.log("Conexión cerrada");

    // Responder con los resultados de la consulta
    res.json(Qns);
    console.log(Qns);
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
});

//Editar
app.put('/quienesSomosEdit/:id', async (req, res) => {
  const QSId = req.params.id; // Obtener el ID de los datos a editar desde los parámetros de la solicitud
  const datos = req.body; // Obtener los datos a editar desde el cuerpo de la solicitud
  console.log(datos);
  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("QuienesSomos");

    // Realizar la actualización de los datos en la colección
    const result = await collection.updateOne({ _id: new ObjectId(QSId) }, { $set: datos });

    // Verificar si se actualizó correctamente
    if (result.modifiedCount === 1) {
      console.log("Datos actualizados correctamente.");
      res.status(200).send("Datos actualizados correctamente.");
    } else {
      console.log("Los datos no pudieron ser encontrados o actualizados.");
      res.status(404).send("Los datos no pudieron ser encontrados o actualizados.");
    }

    // Cerrar la conexión
    client.close();
    console.log("Conexión cerrada");
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
});

//Politicas

app.get('/getPoliticas', async (req, res) => {

  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("Politicas");

    // Realizar la consulta a la colección de POLITICAS
    const politicas = await collection.find({}).toArray();

    // Cerrar la conexión
    client.close();
    console.log("Conexión cerrada");

    // Responder con los resultados de la consulta
    res.json(politicas);
    console.log(politicas);
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
});

//Editar politicas
app.put('/PoliticasEdit/:id', async (req, res) => {
  const poli = req.params.id; // Obtener el ID de los datos a editar desde los parámetros de la solicitud
  const datos = req.body; // Obtener los datos a editar desde el cuerpo de la solicitud
  console.log(datos);
  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("Politicas");

    // Realizar la actualización de los datos en la colección
    const result = await collection.updateOne({ _id: new ObjectId(poli) }, { $set: datos });

    // Verificar si se actualizó correctamente
    if (result.modifiedCount === 1) {
      console.log("Datos actualizados correctamente.");
      res.status(200).send("Datos actualizados correctamente.");
    } else {
      console.log("Los datos no pudieron ser encontrados o actualizados.");
      res.status(404).send("Los datos no pudieron ser encontrados o actualizados.");
    }

    // Cerrar la conexión
    client.close();
    console.log("Conexión cerrada");
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
});


// Eliminar datos de la empresa
app.delete('/EliminarDatos/:id', async (req, res) => {
  console.log("Datos ente");
  const DatosId = req.params.id; // Obtener el ID del usuario a eliminar desde los parámetros de la solicitud
  console.log(DatosId);
  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("QuienesSomos");

    // Realizar la eliminación de la politica en la colección
    const result = await collection.deleteOne({ _id: new ObjectId(DatosId) });  // Suponiendo que el ID del usuario sea único

    // Verificar si se eliminó la politica correctamente
    if (result.deletedCount === 1) {
      console.log("Datos eliminados correctamente.");
      res.status(200).send("Datos eliminados correctamente.");
    } else {
      console.log("Los datos no pudieron ser encontrados o eliminados.");
      res.status(404).send("Los datos no pudieron ser encontrados o eliminados.");
    }

    // Cerrar la conexión
    client.close();
    console.log("Conexión cerrada");
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
});

// Eliminar una politica
app.delete('/deletep/:id', async (req, res) => {
  console.log("politicas ente");
  const politicaId = req.params.id; // Obtener el ID del usuario a eliminar desde los parámetros de la solicitud
  console.log(politicaId);
  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("Politicas");

    // Realizar la eliminación de la politica en la colección
    const result = await collection.deleteOne({ _id: new ObjectId(politicaId) });  // Suponiendo que el ID del usuario sea único

    // Verificar si se eliminó la politica correctamente
    if (result.deletedCount === 1) {
      console.log("Politica eliminada correctamente.");
      res.status(200).send("Politica eliminada correctamente.");
    } else {
      console.log("La politica no pudo ser encontrada o eliminada.");
      res.status(404).send("La politica no pudo ser encontrado o eliminado.");
    }

    // Cerrar la conexión
    client.close();
    console.log("Conexión cerrada");
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
});

// Agregar una nueva politica
app.post('/InsertarPolitica', async (req, res) => {

  const data = req.body;
  console.log(data);
  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("Politicas");
    // Insertar los datos en la colección
    await collection.insertOne({ ...data }); // Establecer permisos de usuario automáticamente

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





/*Contacto*/
app.post('/InsertarContacto', async (req, res) => {

  const { user, email, comentario, direccion } = req.body;
  console.log(req.body);
  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("Comentarios");

    // Insertar los datos en la colección
    await collection.insertOne({
      user,
      email,
      comentario,
      direccion: {
        calle: direccion.calle,
        ciudad: direccion.ciudad,
        cp: direccion.cp
      }
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
app.get('/getContac', async (req, res) => {

  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("Contacto");

    // Realizar la consulta a la colección de usuarios
    const contac = await collection.find({}).toArray();

    // Cerrar la conexión
    client.close();
    console.log("Conexión cerrada");

    // Responder con los resultados de la consulta
    res.json(contac);
    console.log(contac);
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
});

//Editar
app.put('/ContactoEdit/:id', async (req, res) => {
  const contac = req.params.id; // Obtener el ID de los datos a editar desde los parámetros de la solicitud
  const datos = req.body; // Obtener los datos a editar desde el cuerpo de la solicitud
  console.log(datos);
  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("SensorData");
    const collection = db.collection("Contacto");

    // Realizar la actualización de los datos en la colección
    const result = await collection.updateOne({ _id: new ObjectId(contac) }, { $set: datos });

    // Verificar si se actualizó correctamente
    if (result.modifiedCount === 1) {
      console.log("Datos actualizados correctamente.");
      res.status(200).send("Datos actualizados correctamente.");
    } else {
      console.log("Los datos no pudieron ser encontrados o actualizados.");
      res.status(404).send("Los datos no pudieron ser encontrados o actualizados.");
    }

    // Cerrar la conexión
    client.close();
    console.log("Conexión cerrada");
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
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

/* Quienes somos */
