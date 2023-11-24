document.querySelector("#room-name").focus();

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

function get_room_params() {

    let name = document.getElementById("room-name").value;
    let values = $('#select-users-to-add').val();

    if (values.length === 0) {
        document.getElementById("users-error").innerText = "Users are required";
    } else if (name === "" || name === null) {
        document.getElementById("room-name-error").innerText = "Name is required";
    } else {
        document.getElementById("room-name-error").style.display = "none";
        document.getElementById("users-error").style.display = "none";

        let csrf_token = getCookie('csrftoken');
        let name = document.getElementById("room-name").value;
        let values = $('#select-users-to-add').val();

        $.ajax({
            url: "", headers: {'X-CSRFToken': csrf_token}, type: "POST", data: {
                "room_name": name, "users": values,
            }, success: function (result) {
                if (result.status_code === 200) {
                    document.getElementById('creation-msg').innerText = result.msg;
                    setTimeout(function () {
                        window.location.pathname = "/"
                    }, 2000);
                }
            }, error: function (result) {
                console.log("Error", result)
            }
        });
    }

}

