const express = require("express")
const fsPromises = require("fs/promises")

const app = express()

app.get("/hola", (request, response) => {
    response.write("Hola desde mi endpoint /hola")
    response.end()
})

app.post("/adios", (request, response) => {
    response.send("Estamos haciendo un post desde /adios")
})

/**
 * Ejercicio
 * Hacer un endpoint donde lea un archivo de texto
 * Me tiene que regresar como respuesta el contenido del archivo
 * 
 * Se puede hacer con callbacks, promises -> then/catch, -> async/await
 */

// Async/await -> try catch
app.get("/readFile", async (request, response) => {
    let filePath = "textFile.txt"
    console.log(filePath)

    try {
        response.send(await fsPromises.readFile(filePath,"utf-8"))
    } 
    catch(err){
        response.send("Hubo un error")
    }
})

app.get("/getKoders", async(request, response) => {
    let filePath = "koders.json"

    try{
        const jsonFile = await fsPromises.readFile(filePath, "utf-8")
        const parsedJsonFile = JSON.parse(jsonFile)
        response.send(parsedJsonFile)
    }
    catch(error){
        response.send("Ocurrio un error al consultar el archivo")
    }
})

/**
 * Endpoints que sea /react y me regresen los alumnnos que están en el módulo de React
 */
app.get("/react", async(request, response) => {
    let filePath = "koders.json"

    try {
        const kodersJson = await fsPromises.readFile(filePath, "utf-8")
        const parsedKodersList = JSON.parse(kodersJson).alumnos
        const filteredKodersList = parsedKodersList.filter(koder => koder.modulo.toLowerCase() === "react")

        console.log(filteredKodersList)
        response.send(filteredKodersList)

    } catch (error) {
        response.send("Ocurrió un error al procesar la petición")
    }
})
 

app.listen(8080, () => {
    console.log("Ya estamos escuchando desde nuestro servidor express")
})