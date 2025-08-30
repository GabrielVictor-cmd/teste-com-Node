// npm run dev
// Documentações existem para ler em caso de dúvidas, igualmente aqui, ler a documentação do Express

const express = require("express")
const uuid = require("uuid")
const port = 3000
const app = express()
app.use(express.json())


app.listen(port, () => {
    console.log("Servidor iniciado!")
})    

/*
    Query Params => meusite.com/users?name=gabriel&age=17 // Filtros
    Route Params => /users/2    // Buscar, deletar ou atualizar
    Body Request => {"name":"Gabriel", "age":}

    GET => Buscar informações no back-end
    POST => Criar informações no back-end
    PUT/PATCH => Alterar/atualizar informação no back-end
    DELETE => Deletar uma informação no back-end

    Middlewares => INTERCEPTADOR => Tem o poder de parar ou alterar os dados da requisição
*/        


const users = []

const verificar_ID_usuario = (request, response, next) => {
   const { id } = request.params

   const index = users.findIndex( user => user.id === id)
   if (index < 0){
    return response.status(404).json({ error: "Usuário não encontrado"})
   }
   
   request.userIndex = index
   request.userId = id
   next()
}

app.get("/users", (request, response ) => {
    return response.json(users)
})        

app.post("/users", (request, response ) => {
try {
    const { nome, idade } = request.body
    
    if(idade < 18) throw new Error("Desculpe, apenas usuários com mais de 18 anos")

    const user = { id:uuid.v4(), nome, idade }
    users.push(user)
    
    return response.status(201).json(user)
    
} catch (err) {
    return response.status(401).json({error: err.message})

} finally {
    console.log("Tudo certo ✔")
}
})        

app.put("/users/:id", verificar_ID_usuario, (request, response ) => {
   const { nome, idade } = request.body
   const index = request.userIndex
   const id = request.userId

   const updade_user = { id, nome, idade }

   users[index] = updade_user

   return response.json(updade_user)
}) 

app.delete("/users/:id", verificar_ID_usuario, (request, response) => {
    const index = request.userIndex
    users.splice(index, 1)

    return response.status(204).json()
})

