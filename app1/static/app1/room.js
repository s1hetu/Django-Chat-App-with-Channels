const roomName = JSON.parse(document.getElementById('roomName').textContent);
let room_name = document.querySelector("#room-name");
let chat_message = document.querySelector("#chat-message");
let send_message = document.querySelector("#send-message");
let past_msg = document.querySelector("#past-msg");
let current_user = document.getElementById('request-user').textContent;
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// focus 'chat_message' when user opens the page
chat_message.focus();

// submit if the user presses the enter key
chat_message.onkeyup = function (e) {
    if (e.keyCode === 13) {  // enter key
        send_message.click();
    }
};

let chatSocket = null;

// clear the 'chat_message' and forward the message
send_message.onclick = function () {
    if (chat_message.value.length === 0) return;
    chatSocket.send(JSON.stringify({
        "message": chat_message.value,
    }));
    if (chat_message.user === current_user) {
        consoloe.log("send_message.onclick equal", chat_message, current_user)
        let abc = document.getElementById("current-msg")
        let new_msg = document.createElement("p")
        new_msg.style.textAlign = "right";
        new_msg.style.wordBreak = "break-all";
        let formatted_new_msg = document.createElement("span")
        formatted_new_msg.textContent = `${chat_message.user} : ${chat_message.value}`
        formatted_new_msg.style.border = "1px solid silver"
        formatted_new_msg.style.borderBottomRightRadius = "10px"
        formatted_new_msg.style.borderTopRightRadius = "10px"
        formatted_new_msg.style.padding = "5px 35px 5px 10px"
        formatted_new_msg.style.margin = "0 35px 5px 10px"
        new_msg.appendChild(formatted_new_msg);
        abc.append(new_msg);
        chat_message.value = "";
    }
    else {
        consoloe.log("send_message.onclick Not equal", chat_message, current_user)
        let abc = document.getElementById("current-msg")
        let new_msg = document.createElement("p")
        new_msg.style.textAlign = "left";
        new_msg.style.wordBreak = "break-all";
        let formatted_new_msg = document.createElement("span")
        formatted_new_msg.textContent = `${chat_message.user} : ${chat_message.value}`
        formatted_new_msg.style.border = "1px solid silver"
        formatted_new_msg.style.borderBottomLeftRadius = "10px"
        formatted_new_msg.style.borderTopLeftRadius = "10px"
        formatted_new_msg.style.padding = "5px 35px 5px 10px"
        formatted_new_msg.style.margin = "0 35px 5px 10px"
        new_msg.appendChild(formatted_new_msg);
        abc.append(new_msg);
        chat_message.value = "";
    }
};


function connect() {
    chatSocket = new WebSocket("ws://" + window.location.host + "/ws/" + roomName + "/");

    chatSocket.onopen = function (e) {
        console.log("Successfully connected to the WebSocket.");
    };

    chatSocket.onclose = function (e) {
        console.log("WebSocket connection closed unexpectedly. Trying to reconnect in 2s...");
        setTimeout(function () {
            console.log("Reconnecting...");
            connect();
        }, 2000);
    };

    chatSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        switch (data.type) {
            case "chat_message":
                if (data.user === current_user){
                    let new_msg = document.createElement("p")
                    new_msg.style.textAlign = "right";
                    new_msg.style.wordBreak = "break-all";
                    let formatted_new_msg = document.createElement("span")
                    formatted_new_msg.textContent = `${data.user} : ${data.message}`
                    formatted_new_msg.style.border = "1px solid silver"
                    formatted_new_msg.style.borderBottomLeftRadius = "10px"
                    formatted_new_msg.style.borderTopLeftRadius = "10px"
                    formatted_new_msg.style.padding = "5px 35px 5px 10px"
                    formatted_new_msg.style.margin = "0 35px 5px 10px"
                    new_msg.appendChild(formatted_new_msg);
                    past_msg.append(new_msg);
                    break;
                } else {
                    let new_msg = document.createElement("p")
                    new_msg.style.textAlign = "left";
                    new_msg.style.wordBreak = "break-all";
                    let formatted_new_msg = document.createElement("span")
                    formatted_new_msg.textContent = `${data.user} : ${data.message}`
                    formatted_new_msg.style.border = "1px solid silver"
                    formatted_new_msg.style.borderBottomRightRadius = "10px"
                    formatted_new_msg.style.borderTopRightRadius = "10px"
                    formatted_new_msg.style.padding = "5px 35px 5px 10px"
                    formatted_new_msg.style.margin = "0 35px 5px 10px"
                    new_msg.appendChild(formatted_new_msg);
                    past_msg.append(new_msg);
                    break;
                }

            case "private_message":
                room_name.value += "PM from " + data.user + ": " + data.message + "\n";
                past_msg.append("Private MSG M", data.user, " : ", data.message)

                break;

            default:
                console.error("Unknown message type!");
                break;
        }

    };

    chatSocket.onerror = function (err) {
        console.log("WebSocket encountered an error: " + err.message);
        console.log("Closing the socket.");
        chatSocket.close();
    }

    // button
    send_message.onclick = function () {
        if (chat_message.value.length === 0) return;
        chatSocket.send(JSON.stringify({
            "message": chat_message.value,
        }));
        chat_message.value = "";
    };
}

connect();

let csrf_token = getCookie('csrftoken');

function exit_group() {
    $.ajax({
        url: "/exit_room/", type: "POST", headers: {'X-CSRFToken': csrf_token}, data: {
            "room_name": roomName
        }, success: function (result) {
            if (result.status_code === 200) {
                document.getElementById("exit-group-message").innerText = result.message;
                setTimeout(function () {
                    window.location.pathname = "/"
                }, 2000);
            }
        }, error: function (result) {
            console.log("Error", result)
        }

    })
}

