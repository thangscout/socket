const socket = io('localhost:8000');

let socketSelf = null;

socket.on('connect', ()=>{
    console.log('connected');
    socket.emit('LOGIN_REQUEST', prompt('ENTER USERNAME'));

    socket.on('LOGIN_RESP', resp => {
        const { users, socketID } = resp;

        socketSelf = socketID;

        if(!users) return alert('USERNAME EXIST');

        users.forEach(user => {
            $('#listUser').append(` 
                <li id="item_user_${user.socketID}">
                    <a href="javascript:void(0)">
                    <img src="plugins/images/users/varun.jpg" alt="user-img" class="img-circle">
                    <span>${user.username}<small class="text-success">online</small></span></a>
                </li>
            `)
        });

        socket.on('NEW_USER', user =>{
            $('#listUser').append(` 
                <li id="item_user_${user.socketID}">
                    <a href="javascript:void(0)">
                    <img src="plugins/images/users/varun.jpg" alt="user-img" class="img-circle">
                    <span>${user.username}<small class="text-success">online</small></span></a>
                </li>
            `)
        })
    });

    socket.on('NEW_MESSAGE', resp => {
        const { message, username, socketID } = resp;

        if(socketSelf.toString() === socketID.toString()){
            $('#listMessage').append(`
                <li class="odd">
                    <div class="chat-image"> <img alt="Female" src="plugins/images/users/genu.jpg"> </div>
                    <div class="chat-body">
                        <div class="chat-text">
                            <h4>${username}</h4>
                            <p>${message}</p> <b>10.00 am</b><b>10.03 am</b>
                        </div>
                    </div>
                </li>
            `)
        }else{
            $('#listMessage').append(`
                <li>
                    <div class="chat-image"> <img alt="male" src="plugins/images/users/ritesh.jpg"> </div>
                    <div class="chat-body">
                        <div class="chat-text">
                            <h4>${username}</h4>
                            <p>${message}</p> <b>10.00 am</b>
                        </div>
                    </div>
                </li>
            `)
        }
    });
    socket.on('USER_LOGOUT', resp => {
        const{ socketID } = resp;
        $(`#item_user_${socketID}`).remove();
        alert(`${socketID} logout`);
    });

    socket.on('INPUTING_SSC', username => {
        // console.log({ username});
        $('#infoTying').empty();
        $('#infoTying').append(`
            <div class="chat-body">
                <div class="chat-text">
                    <p> ${username} đang nhập...</b>
                    </div>
            </div>
        `)
    });
    socket.on('STOPPED_INPUT_SSC', ()=> {
        $('#infoTying').empty();
        // console.log(`STOPPED_INPUT_SSC`);

    })
});

$('#btnSend').on('click', ()=>{
    let message = $('#txtMessage').val();

    socket.emit('SEND_MESSAGE_CSS', message);
    $('#txtMessage').val('');
});

$('#txtMessage').on('keyup', function(){
    socket.emit('INPUTING_CSS');
});

$('#txtMessage').on('focusout', function(){
    socket.emit('STOPPED_INPUT_CSS');
});