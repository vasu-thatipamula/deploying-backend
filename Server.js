const express = require("express")
const {open} = require("sqlite")
const sqlite3 = require("sqlite3")
const path = require("path")
const cors = require("cors")

const dbpath = path.join(__dirname,"todo.db")

let db 
const app = express()
app.use(express.json())
app.use(cors({ origin: "http://localhost:3001" }))

const initializeDBAndServer = async() => {
    try {
        db = await open({
            filename : dbpath,
            driver : sqlite3.Database
        });
        app.listen(3000,() => {
            console.log("Server is running on https://localhost:3000")
        })

    }
    catch (err) {
        console.log("Server Error : ",(err.message))
        process.exit(1)
    }
}

initializeDBAndServer()

app.get("/api/todos", async (request,response) => {
    const getquery = "select * from todos;"
    const responseData = await db.all(getquery)
    response.send(responseData)
})

app.post("/api/todos",async (request,response) => {
    const {todo_name} = request.body
    const createquery = `insert into todos(todo_name) values (?);`
    const postresponse = await db.run(createquery,[todo_name])
    // console.log(postresponse)
    const getquery = "select * from todos;"
    const responseData = await db.all(getquery)
    response.send(responseData)
    

})

app.delete("/api/todos/:id",async (request,response) => {
    const {id} = request.params
    const deletequery = `delete from todos where id = ${id}`
    const delresponse = await db.run(deletequery)
    const getquery = "select * from todos;"
    const responseData = await db.all(getquery)
    response.send(responseData)
})

app.put("/api/todos/:id",async (request,response) => {
    const {id} = request.params
    const {todo_name} = request.body
    const updatequery = `update todos set todo_name = ? where id = ?;`
    const putresponse = await db.run(updatequery,[todo_name,id])
    const getquery = "select * from todos;"
    const responseData = await db.all(getquery)
    response.send(responseData)
})
