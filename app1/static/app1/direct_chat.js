console.log("Sanity check from direct_chat.js.");

const MsgToUser = JSON.parse(document.getElementById('MsgToUser').textContent);
const current_user = JSON.parse(document.getElementById('current_user').textContent);
let to_user = document.querySelector("#to_user_msg");
let chat_message = document.querySelector("#chat-message");
let send_message = document.querySelector("#send-message");
let past_msg = document.querySelector("#past-msg");

// submit if the user presses the enter key
chat_message.onkeyup = function(e) {
    if (e.keyCode === 13) {  // enter key
        send_message.click();
    }
};

// clear the 'chat_message' and forward the message
send_message.onclick = function() {
    if (chat_message.value.length === 0) return;
    chatSocket.send(JSON.stringify({
        "message": chat_message.value,
    }));
    // TODO: forward the message to the WebSocket
    chat_message.value = "";
};

let chatSocket = null;

function connect() {
    chatSocket = new WebSocket("ws://" + window.location.host + "/ws/p/" + MsgToUser + "/");

    chatSocket.onopen = function(e) {
        console.log("Successfully connected to the WebSocket.");
    };

    chatSocket.onclose = function(e) {
        console.log("WebSocket connection closed unexpectedly. Trying to reconnect in 2s...");
        setTimeout(function() {
            console.log("Reconnecting...");
            connect();
        }, 2000);
    };

    chatSocket.onerror = function(err) {
        console.log("WebSocket encountered an error: " + err.message);
        console.log("Closing the socket.");
        chatSocket.close();
    };
    
    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        console.log(data);
        if (data.type == "personal_message") {
            past_msg.append(data.user, " : ", data.message);
        }
        else{
            console.error("Unknown message type!"); 
        }
    };

    // button
    send_message.onclick = function() {
        if (chat_message.value.length === 0) return;
        chatSocket.send(JSON.stringify({
            "message": chat_message.value,
        }));
        
        past_msg.append(current_user, " : ", chat_message.value);
        chat_message.value = "";
    };
}
connect();

