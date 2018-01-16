document.addEventListener("impress:stepenter", function (event) {
    if(event.target.id == 'step-1') { 
        document.getElementById('zendlogo').style.display = "none";
        document.getElementById('meetmagentologo').style.display = "none";
    }
    else {
        document.getElementById('zendlogo').style.display = "block";
        document.getElementById('meetmagentologo').style.display = "block";
    }
});