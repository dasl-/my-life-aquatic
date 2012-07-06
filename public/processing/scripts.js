$(function() {
	var isJelliesShowing 	= false;
	var isPondShowing		= true;
	
	$("#jellies-btn").click( toggleJellies );
	$("#pond-btn").click( togglePond );
	$("#pond-btn").css( "opacity", 0.5 );
	
	toggleJellies();
	togglePond();
	
	function toggleJellies() {
		if ( isJelliesShowing === false ) {
			$("#jellies-canvas").show();
			$("#jellies-btn").css( "opacity", 0.5 );
		}
		else {
			$("#jellies-canvas").hide();
			$("#jellies-btn").css( "opacity", 1 );
		}
		
		if ( isPondShowing ) {
			togglePond();
		}
		
		isJelliesShowing = !isJelliesShowing;
	}
	
	function togglePond() {
		if ( isPondShowing === false ) {
			$("#pond-canvas").show();
			$("#pond-btn").css( "opacity", 0.5 );
		}
		else {
			$("#pond-canvas").hide();
			$("#pond-btn").css( "opacity", 1 );
		}
		
		if ( isJelliesShowing ) {
			toggleJellies();
		}
		
		isPondShowing = !isPondShowing;
	}
});