const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 8000;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.get('/', (req, res)=> res.render('chat'));

const users = [];
/**
 * Username
 * socketID
 * 
 */


//Socket Server
io.on('connection', socket => {
    // console.log({ socketID: socket.id });
    const { id: socketID} = socket;

    socket.on('LOGIN_REQUEST', username => {

        let indexExist = users.findIndex( user => user.username === username );
        if(indexExist >= 0 || !username) return socket.emit('LOGIN_RESP', null);

        socket.username = username;
        const obj = { username, socketID };

        socket.emit('LOGIN_RESP', { users, socketID });

        users.push(obj);

        socket.broadcast.emit('NEW_USER', obj);
    });

    socket.on('SEND_MESSAGE_CSS', message => {
        const { username } = socket;
        io.emit('NEW_MESSAGE', { message, username, socketID });
    });

    socket.on('INPUTING_CSS', ()=>{
        const { username } = socket;
        socket.broadcast.emit('INPUTING_SSC', username);
    });

    socket.on('STOPPED_INPUT_CSS', ()=>{
        // const { username } = socket;
        // console.log(`STOPPED_INPUT_CSS`);
        socket.broadcast.emit('STOPPED_INPUT_SSC', null);
    });    

    socket.on('disconnect', socket => {
        // console.log({ socket });
        const { username } = socket;
        let indexUser = users.findIndex(user => user.username === username);
        users.splice(indexUser, 1);

        io.emit('USER_LOGOUT', { socketID });
    });
});

server.listen(port, ()=> console.log(`Server started at port ${port}`));