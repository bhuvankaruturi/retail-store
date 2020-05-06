const handleUsernameChange = function(event) {
    if (event.target.value.trim() != "") {
        validateUsername(event.target.value.trim());
    } else {
        let usernameerror = document.getElementById('usernameerror');
        usernameerror.style.display = "none";
        usernameerror.innerHTML = "";
    }
}

const validateUsername = function(username) {
    let params = new URLSearchParams();
    params.append('username', username);
    $.ajax({
        type: "get",
        url: "http://localhost:3000/check?"+params.toString(),
        crossDomain: true,
        dataType: "json",
        success: function (response) {
            let usernameerror = document.getElementById('usernameerror');
            if (!response.valid) {
                usernameerror.style.display = "block";
                usernameerror.innerHTML = "username " + username + " already exists";
            } else {
                usernameerror.style.display = "none";
                usernameerror.innerHTML = "";
            }
        }
    });
}

let passwordStrength = {
    "border": "2px solid",
    "border-color": "black"
};

var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

const analyze = function(event) {
    let errorDiv = document.getElementById('error');
    errorDiv.innerHTML = null;
    let value = event.target.value;
    if (value.trim() == "") return;
    if(strongRegex.test(value)) {
        passwordStrength["border-color"] = "green";
    } else if(mediumRegex.test(value)) {
        passwordStrength["border-color"] = "orange";
    } else {
        passwordStrength["border-color"] = "red";
    }
    applyStyle();
}

const applyStyle = function() {
    let password = document.getElementById('password');
    for (var key of Object.keys(passwordStrength)) {
        password.style[key] = passwordStrength[key];
    }
}

const validate = function(event) {
    if (document.getElementById('usernameerror').style.display == 'block') {
        event.preventDefault();
    }
    let password = document.getElementById('password');
    if (!strongRegex.test(password.value)) {
        event.preventDefault();
        let errorDiv = document.getElementById('error');
        errorDiv.innerHTML = "weak password";
        errorDiv.style.color = "red";
    }

}

$('#item-image').on('change', function(e) {
    input = e.target;
    if (input.files && input.files[0]) {

        var reader = new FileReader();
        reader.onload = function(e) {
            $('#uploaded_img')
                .attr('src', e.target.result);
            console.log(e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
});