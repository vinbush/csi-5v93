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
})
