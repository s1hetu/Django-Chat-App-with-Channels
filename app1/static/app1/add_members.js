let room = document.getElementById('room-name').textContent;
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

function add_members() {
    let selected_members = $("#add-members-to-room").val();
    console.log(selected_members, "MEME")
    if (selected_members.length === 0) {
        document.getElementById('user-error').innerText = "Please select at-least one user";
    } else {
        document.getElementById('user-error').innerText = "";
        let csrf_token = getCookie('csrftoken');
        let selected_members = $("#add-members-to-room").val();
        console.log(selected_members)
        $.ajax({
            url: `/add_members/${room}/`,
            type: "POST",
            headers: {"X-CSRFToken": csrf_token}, data: {
                "users": selected_members,
                "room_name": room
            }, success: function (result) {
                if (result.status_code === 200) {
                    document.getElementById("users-added-msg").innerText = result.message;
                    setTimeout(function () {
                        window.location.pathname = `/${room}/`
                    }, 3000);

                }
            }, error: function (result) {
                console.log("Error", result)
            }
        })
    }


}