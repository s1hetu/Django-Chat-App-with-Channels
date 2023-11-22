const roomName = JSON.parse(document.getElementById('roomName').textContent);
let room_name = document.querySelector("#room-name");
let chat_message = document.querySelector("#chat-message");
let send_message = document.querySelector("#send-message");
let online_users = document.querySelector("#online-users");
let past_msg = document.querySelector("#past-msg");

// adds a new option(to the dropdown created for online-users) to 'online_users'
function online_usersAdd(value) {
    if (document.querySelector("option[value='" + value + "']")) return;
    let newOption = document.createElement("option");
    newOption.value = value;
    newOption.innerHTML = value;
    online_users.appendChild(newOption);
}

// removes an option(from the dropdown created for online-users) from 'online_users'
function online_usersRemove(value) {
    let oldOption = document.querySelector("option[value='" + value + "']");
    if (oldOption !== null) oldOption.remove();
}

// focus 'chat_message' when user opens the page
chat_message.focus();

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

online_users.onchange = function() {
    chat_message.value = "/pm " + online_users.value + " ";
    online_users.value = null;
    chat_message.focus();
};

let chatSocket = null;

function connect() {
    chatSocket = new WebSocket("ws://" + window.location.host + "/ws/" + roomName + "/");

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

    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        console.log(data);
        switch (data.type) {
            case "chat_message":
                // room_name.value += data.user + ": " + data.message + "\n";  // new
                console.log(data.message)
                past_msg.append(data.user, " : ", data.message, "                                           ")
                break;
            
            case "user_list":
                for (let i = 0; i < data.users.length; i++) {
                    online_usersAdd(data.users[i]);
                }
                break;

            case "user_join":
                room_name.value += data.user + " joined the room.\n";
                online_usersAdd(data.user);
                break;

            case "user_leave":
                room_name.value += data.user + " left the room.\n";
                online_usersRemove(data.user);
                break;

            case "private_message":
                room_name.value += "PM from " + data.user + ": " + data.message + "\n";
                past_msg.append("Private MSG M", data.user, " : ", data.message)
                
                break;

            case "private_message_delivered":
                room_name.value += "PM to " + data.target + ": " + data.message + "\n";
                past_msg.append("Private MSG D",data.user, " : ", data.message)
                break;

            default:
                console.error("Unknown message type!");
                break;
        }
    
        // scroll 'room_name' to the bottom
        room_name.scrollTop = room_name.scrollHeight;
    };

    chatSocket.onerror = function(err) {
        console.log("WebSocket encountered an error: " + err.message);
        console.log("Closing the socket.");
        chatSocket.close();
    }

    // button
    send_message.onclick = function() {
        if (chat_message.value.length === 0) return;
        chatSocket.send(JSON.stringify({
            "message": chat_message.value,
        }));
        chat_message.value = "";
    };
}
connect();

