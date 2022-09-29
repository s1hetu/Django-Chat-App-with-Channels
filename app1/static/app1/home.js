console.log("Check from home.js.");
// focus 'chat-room' when user opens the page
document.querySelector("#chat-room").focus();

// window.location : get current page address (URL) redirect browser to new page.

// submit if the user presses the enter key
// if user types anything inside text, call func -> if key is enter, click the button
document.querySelector("#chat-room").onkeyup = function(e) {
    if (e.keyCode === 13) {  // enter key
        document.querySelector("#chat-button").click();
    }
};

// redirect to '/room_name/'
// if button is clicked, call func -> set room = given room and redirect to <room_name>
document.querySelector("#chat-button").onclick = function() {
    let roomName = document.querySelector("#chat-room").value;
    window.location.pathname = roomName + "/";
}

// redirect to '/room-name/'
// if any of the specified room is selected, call func -> set room = given room and redirect to <room_name>
document.querySelector("#select-room").onchange = function() {
    let roomName = document.querySelector("#select-room").value.split(" (")[0];
    window.location.pathname = roomName + "/";
}







// redirect to '/room-name/'
// if any of the specified room is selected, call func -> set room = given room and redirect to <room_name>
document.querySelector("#chat-personal").onchange = function() {
    let msgToUser = document.querySelector("#chat-personal").value;
    console.log()
    window.location.pathname = "p/" + msgToUser + "/";
}

