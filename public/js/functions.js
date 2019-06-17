$(document).ready(function($) {
    $(".clickable-row").click(function() {
    	$(this).children(".text").addClass("textL").removeClass("text");
    });
});


$(document).ready(function($){
	$(".insc").click(function(){
		//console.log($(this).data("href"));
		window.location = $(this).data("href");
	});
});



