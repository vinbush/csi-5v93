$(function() {
    $(".tab").hide();
    $("#dialer").show();
});

$(".tab-switch-btn").click(function() {
    $(".tab-switch-btn").removeClass("active");
    $(this).addClass("active");
    var selector = $(this).data("target")
    $(".tab").hide();
    $(selector).show();
});

$(".dialer-btn.number-btn").click(function() {
    var oldNum = $("#dialer-number").val();
    var newNum = $(this).val();
    $("#dialer-number").val(oldNum + newNum);
});

$("#clear-btn").click(function() {
    $("#dialer-number").val("");
});

// yeah global variables because handling state in javascript sucks
var downX = 0;
var downY = 0;

$("#gesture-area").mousedown(function(event) {
    $("#gesture-output").val("mouse down");
    downX = event.pageX;
    downY = event.pageY;
});

$("#gesture-area").mouseup(function(event) {
    $("#gesture-output").val("mouse up");
    upX = event.pageX;
    upY = event.pageY;

    if (upX < downX) {
        $("#gesture-output").val("swipe left")
    } else if (upX > downX) {
        $("#gesture-output").val("swipe right")
    }
});
