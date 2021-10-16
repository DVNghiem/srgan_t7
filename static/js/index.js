let input_image = document.getElementById("input_image");
let process = document.getElementById("process");
input_image.addEventListener("change", handleFiles, false);
process.addEventListener("click", handlePost, false);

function handleFiles() {
    let reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById("img_tar").src = e.target.result;
    };
    reader.readAsDataURL(this.files[0]);
}

async function handlePost() {
    const formData = new FormData();
    formData.append("value", input_image.files[0]);
    formData.append("csrfmiddlewaretoken", getCookie("csrftoken"));

    const data = await fetch(
        "http://0.0.0.0:80/p/",
        {
            method: "POST",
            body: formData,
        },

        (document.getElementById("111").style.display = "block")
    ).then((response) => {
        document.getElementById("111").style.display = "none";
        return response.json();
    });
    const base64 = data.data;
    document.getElementById(
        "out_image"
    ).src = `data:image/png;base64, ${base64}`;
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(
                    cookie.substring(name.length + 1)
                );
                break;
            }
        }
    }
    return cookieValue;
}
