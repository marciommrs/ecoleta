import express, { request, response } from 'express';

const app = express();

app.use(express.json());


// --------------------------------------------------------------------------------
// TIPOS DE PARAMETROS
// --------------------------------------------------------------------------------

const users = [
    'Diego',
    'Cleiton',
    'Robson',
    'Daniel',
    'Marcio'
];

// Query Param: Parâmetros que vem na prórpia rota geralmente opcionais para filtros, paginação.
// http://localhost:3333/users?search=on
app.get('/users', (request, response) => {
    const search = String(request.query.search); // Forçando a conversão do array em string.
    const filteredUsers = search? users.filter(user => user.includes(search)) : users;
    return response.json(filteredUsers);
});

// Request Param: Parâmetros que vem na própria rota que identificam um recursos.
// http://localhost:3333/users/4
app.get('/users/:id', (request, response) => {
    const id = Number(request.params.id);
    const user = users[id];
    return response.json(user);
});

// Request Body: Parâmetros para criação/atualização de informações.
// http://localhost:3333/users
// JSON
// {
//    name: "Marcio Marques Rosa",
//    email: "marcio.mmrs@gmail.com"
//}
app.post('/users', (request, response) => {
    const data = request.body;
    const user = {
        name: data.name,
        email: data.email
    }
    return response.json(user);
});

app.listen(3333);