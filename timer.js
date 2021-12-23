var sec = 0;

function pad(val) { return val > 9 ? val : "0" + val; }
setInterval(function() {
    document.getElementById("seconds").innerHTML = pad(++sec % 60);
    document.getElementById("minutes").innerHTML = pad(parseInt(sec / 60, 10));
}, 1000);

function changeColor() {
    document.getElementById("clock").style.color = "red";
    document.getElementById("breakPrompt").innerHTML = "Please press the button now to proceed to the next block.";
}
setInterval(changeColor, 180000);