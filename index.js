const express = require("express");
const fsPromises = require("fs/promises");

const app = express();

app.get("/hola", (request, response) => {
  response.write("Hola desde mi endpoint /hola");
  response.end();
});

app.post("/adios", (request, response) => {
  response.send("Estamos haciendo un post desde /adios");
});

/**
 * Ejercicio
 * Hacer un endpoint donde lea un archivo de texto
 * Me tiene que regresar como respuesta el contenido del archivo
 *
 * Se puede hacer con callbacks, promises -> then/catch, -> async/await
 */

// Async/await -> try catch
app.get("/readFile", async (request, response) => {
  let filePath = "textFile.txt";
  console.log(filePath);

  try {
    response.send(await fsPromises.readFile(filePath, "utf-8"));
  } catch (err) {
    response.send("Hubo un error");
  }
});

app.get("/getKoders", async (request, response) => {
  let filePath = "koders.json";

  try {
    const jsonFile = await fsPromises.readFile(filePath, "utf-8");
    const parsedJsonFile = JSON.parse(jsonFile);
    response.send(parsedJsonFile);
  } catch (error) {
    response.send("Ocurrio un error al consultar el archivo");
  }
});

/**
 * Endpoints que sea /react y me regresen los alumnnos que están en el módulo de React
 */
app.get("/react", async (request, response) => {
  let filePath = "koders.json";

  try {
    const kodersJson = await fsPromises.readFile(filePath, "utf-8");
    const parsedKodersList = JSON.parse(kodersJson).alumnos;
    const filteredKodersList = parsedKodersList.filter(
      (koder) => koder.modulo.toLowerCase() === "react"
    );

    console.log(filteredKodersList);
    response.send(filteredKodersList);
  } catch (error) {
    response.send("Ocurrió un error al procesar la petición");
  }
});

/**
 * Path param
 */

app.get("/koder/:id", async (request, response) => {
  let filePath = "koders.json";
  try {
    const { id } = request.params;

    const kodersList = await fsPromises.readFile(filePath, "utf-8");
    const kodersJson = JSON.parse(kodersList);

    const filteredKoder = kodersJson.alumnos.filter(
      (koder) => koder.id === parseInt(id)
    );
    response.send(filteredKoder);
  } catch (error) {
    response.send("Ocurrió un error al procesar la petición");
  }
});

/**
 * Query params
 *
 */
/* app.get("/koders", async (request, response) => {
  // Destructuracion

  const { mod, gen } = request.query; // Del objeto query sacamos los queryparams

  console.log("mod", mod);
  console.log("gen", gen);

  const koders = await fsPromises.readFile("koders.json", "utf-8");
  const kodersJson = JSON.parse(koders); // que este parseado a json.
  response.json(kodersJson.alumnos); // -> Content/Type = application/json
}); */

/**
 * Endpoint: GET
 * Ruta /koders/:name
 * queryParam -> modulo
 * pathParam -> name
 * Path example -> localhost:8080/koders/Marco?moduleName=react
 */

app.get("/koders/:name", async (request, response) => {
  const filePath = "koders.json";

  const { name } = request.params;
  const koders = await fsPromises.readFile(filePath, "utf-8");
  const kodersJson = JSON.parse(koders);

  const { moduleName } = request.query;

  const filteredKoders = kodersJson.alumnos.filter(
    (koder) =>
      koder.name.toLowerCase() === name.toLowerCase() &&
      koder.modulo.toLowerCase() === moduleName.toLowerCase()
  );

  console.log(filteredKoders.length);

  if (filteredKoders.length === 0)
    response.send("No se encontraron resultados");
  else response.json(filteredKoders);
});

/**
 * Posting a koder
 */

app.listen(8080, () => {
  console.log("Ya estamos escuchando desde nuestro servidor express");
});
