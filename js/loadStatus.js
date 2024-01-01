(function(){
	context.font = "15px Arial";
	const displayFunction = function(){
		if(initSchedule) {
			let total = initSchedule.completed + initSchedule.tasks;
			let text = initSchedule.completed + "/" + total + "   " + initSchedule.name.name;
			clearMainCanvas();
			context.fillText(text,10,20);
			window.requestAnimationFrame(displayFunction);
		}
	};
	window.requestAnimationFrame(displayFunction);
})();
