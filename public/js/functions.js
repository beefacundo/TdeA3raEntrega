const listRows = document.getElementsByClassName("clickable-row");
for (var i=0, max=listRows.length; i < max; i++) {
	listRows[i].addEventListener("click", function(){
		var el = this.nextSibling.nextSibling;
		var to = this.childNodes[3];
		if (to.classList.contains("text")){
			to.classList.remove("text");
		} else {
			to.classList.add("text");
		}
		if (el.style.display === "none") {
		    el.style.display = "table-row";
		  } else {
		    el.style.display = "none";
		  }
	});
};