const socket = io.connect('/');

const message = document.getElementById('message');
const messages = document.getElementById('messages');

const handleSubmitNewMessage = () => {
    const newMessage = { name: 'younghwan', data: { "message" : message.value } }
    socket.emit('message', newMessage);
};

socket.on('message', (message) => {
    handleNewMessage(message);
});

const handleNewMessage = (message) => {
    messages.appendChild(buildNewMessage(message));
};

const buildNewMessage = (message) => {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(message.name + ' ' + message.data.message));
    return li
};
