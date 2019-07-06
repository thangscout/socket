const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 8000;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.get('/', (req, res)=> res.render('home'));

//Socket Server
io.on('connection', socket => {
    console.log({ socketID: socket.id });

    socket.on('disconnect', socket => {
        console.log({ socket });
    });
});

server.listen(port, ()=> console.log(`Server started at port ${port}`));