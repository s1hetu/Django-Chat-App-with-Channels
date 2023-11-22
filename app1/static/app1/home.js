console.log("KKKKKKk")


// Enter key as send
// document.querySelector("#chat-room").onkeyup = function (e) {
//     if (e.keyCode === 13) {  // enter key
//         document.querySelector("#chat-button").click();
//     }
// };

// When chat button is clicked, redirect to selected chat room
// document.querySelector("#chat-button").onclick = function () {
//     let roomName = document.querySelector("#chat-room").value;
//     window.location.pathname = roomName + "/";
// }

// When room is selected, redirect to room's chat
document.querySelector("#select-room").onchange = function () {
    let roomName = document.querySelector("#select-room").value.split(" (")[0];
    window.location.pathname = roomName + "/";
}

// When user is selected, redirect to user's chat
document.querySelector("#chat-personal").onchange = function () {
    let msgToUser = document.querySelector("#chat-personal").value;
    console.log()
    window.location.pathname = "p/" + msgToUser + "/";
}

