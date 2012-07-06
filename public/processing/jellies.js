var numJellies		= 3;
var jellies			= [numJellies];

var jellyStyle = {
    fillColor:		"#FB4C9F",
	strokeColor: 	"#CA2A65",
	strokeJoin:		"round",
	strokeWidth:	2
};

var tentacleStyle = {
    strokeColor:	"#CA2A65",
	strokeWidth:	2
};

var tentacleTipStyle = {
	fillColor: 	"#CA2A65"
};

var particleStyle = {
	strokeColor: 	"#CA2A65"
};


// Paperjs direct mode settings
paper.install( window );


window.onload = function() {
	paper.setup( "jellies-canvas" );
	
	// Create jellies
	for ( var j = 0; j < numJellies; j++ ) {
		jellies[j] = new Jelly();
		jellies[j].init();
	}
	
	// Set drawing loop
	view.onFrame = draw;
};


function draw( evt ) {
	for ( var j = 0; j < numJellies; j++ ) {
		jellies[j].wander();
		//jellies[j].seek( mouse );
		jellies[j].update( evt );
		jellies[j].checkBounds();
	}
}



// -------------------------------------
// ---- Jelly Class BEGIN

function Jelly() {
	this.path 			= new Path();
	this.location		= new Point( -100 , Math.random() * (view.size.height * 0.5) );
	this.velocity		= new Point( 0, 0 );
	this.acceleration	= new Point( 0, 0 );
	
	var maxSpeed		= Math.random() * 0.4 + 1;
	var maxForce		= 0.4;
	var pathRadius 		= 55 + Math.random() * 15;
	var pathRes 		= 25;
	var pathPoints 		= [pathRes];
	
	var angle 			= (Math.PI * 2) / pathRes;
	var wrapAngle 		= (Math.PI / 2) + angle;
	var wanderTheta		= 0;
	
	var orientation		= 0;
	var lastOrientation = 0;
	var lastLocation;
	
	var numTentacles 	= 12;
	var tentacles 		= [numTentacles];
	
	var particleSpan	= parseInt( Math.random() * 300 );
	var particleCount 	= 0;
	var particles		= [];
	
	
	this.init = function() {
		// Creates body path
		for ( var i = 0; i < pathRes; i++ ) {
			var theta 		= angle * i;
			var thetaUp 	= theta - (Math.PI / 2);
			var point 		= new Point();
			
			// Upper side of the body
			if ( theta < wrapAngle ) {
				point.x = Math.cos( thetaUp ) * pathRadius;
				point.y = Math.sin( thetaUp ) * pathRadius;
			}
			// Inner side
			else if ( theta > wrapAngle && theta + (angle * 2) < wrapAngle + Math.PI ) {
				point.x = Math.cos( thetaUp ) * pathRadius;
				point.y = Math.sin( thetaUp ) * ((-pathRadius * 0.85) + pathRadius * 1.25);
			}
			// The other upper side of the body
			else {
				point.x = Math.cos( thetaUp ) * pathRadius;
				point.y = Math.sin( thetaUp ) * pathRadius;
			}
			
			pathPoints[i] = point;
			this.path.add( point );
		}
		this.path.closed 	= true;
		this.path.style 	= jellyStyle;
		this.path.opacity = 0.8;
		
		// Create tentacles
		for ( var t = 0; t < numTentacles; t++ ) {
			tentacles[t] = new Tentacle();
			tentacles[t].init();
		}
		
	};
	
	
	this.update = function( evt ) {
		lastLocation = this.location.clone();
		
		this.velocity.x += this.acceleration.x;
		this.velocity.y += this.acceleration.y;
	    this.velocity.length = Math.min( maxSpeed, this.velocity.length );
	    
	    this.location.x += this.velocity.x;
	    this.location.y += this.velocity.y;
	    
	    this.acceleration.length = 0;
		
		// Change jelly path position, without this it won't move
		this.path.position = this.location.clone();
		
		// Rotation alignment
		var locVector = new Point( this.location.x - lastLocation.x, this.location.y - lastLocation.y );
		orientation = locVector.angle + 90;
		this.path.rotate( orientation - lastOrientation );
		lastOrientation = orientation;
		
		// Contraction, expansion motion
		for ( var n = 0; n < pathRes; n++ ) {
			var segment 	= this.path.segments[n];
			var sineSeed 	= (evt.count * maxSpeed + (pathPoints[n].y * 0.55)) / 10;
			
			segment.point.x += pathPoints[n].rotate( orientation ).normalize().x * Math.sin( sineSeed );
			segment.point.y += pathPoints[n].rotate( orientation ).normalize().y * Math.sin( sineSeed );
		}
		
		// Attach tentacles to the bottom segments of the body
		// 7 is entirely arbitrary, this needs to be dynamic 
		for ( var t = 0; t < numTentacles; t++ ) {
			tentacles[t].update( orientation );
			tentacles[t].head.point = this.path.segments[7 + t].point;
		}
		
		// Create bubble particles
		if ( evt.count % particleSpan == 0 ) {
			particleSpan = parseInt( Math.random() * 100 + 150 );
			
			particleCount++;
			particles.push( new Particle( particleCount - 1, this.path.position.clone() ) );
		}
		
		// Update bubble particles
		// If a particle die remove it from array
		for ( var p = 0; p < particles.length; p++ ) {
			var particle = particles[p];
			if ( particle.isDead === true && particle.path.opacity === 0 ) {
				particles.splice( 0, 1 );
			}
			else {
				particle.update( evt );
			}
		}
		
	};
	
	
	this.steer = function( target, slowdown ) {
		var steer;
		var desired	= new Point( target.x - this.location.x, target.y - this.location.y );
		var dist 	= desired.length;
		
		if ( dist > 0 ) {
			if ( slowdown && dist < 100 ) {
				desired.length = maxSpeed * ( dist / 100 );
			}
			else {
				desired.length = maxSpeed;
			}
			
			steer = new Point( desired.x - this.velocity.x, desired.y - this.velocity.y );
			steer.length = Math.min( maxForce, steer.length );
		}
		else {
			steer = new Point( 0, 0 );
		}
		return steer;
	}
	
	
	this.seek = function( target ) {
		var steer = this.steer( target, false );
		this.acceleration.x += steer.x;
		this.acceleration.y += steer.y;
	}
	
	
	this.wander = function() {
		var wanderR 	= 5;
		var wanderD		= 100;
		var change		= 0.05;
		
		wanderTheta += Math.random() * (change * 2) - change;
		
		var circleLocation = this.velocity.clone();
		circleLocation = circleLocation.normalize();
		circleLocation.x *= wanderD;
		circleLocation.y *= wanderD;
		circleLocation.x += this.location.x;
		circleLocation.y += this.location.y;
		
		var circleOffset = new Point( wanderR * Math.cos( wanderTheta ), wanderR * Math.sin( wanderTheta ) );
		
		var target = new Point( circleLocation.x + circleOffset.x, circleLocation.y + circleOffset.y );
		
		this.seek( target );
	}
	
	
	this.checkBounds = function() {
		var offset = 200;
		if ( this.location.x < -offset ) {
			this.location.x = view.size.width + offset;
			for ( var t = 0; t < numTentacles; t++ ) {
				tentacles[t].path.position = this.location.clone();
			}
		}
		if ( this.location.x > view.size.width + offset ) {
			this.location.x = -offset;
			for ( var t = 0; t < numTentacles; t++ ) {
				tentacles[t].path.position = this.location.clone();
			}
		}
		if ( this.location.y < -offset ) {
			this.location.y = view.size.height + offset;
			for ( var t = 0; t < numTentacles; t++ ) {
				tentacles[t].path.position = this.location.clone();
			}
		}
		if ( this.location.y > view.size.height + offset ) {
			this.location.y = -offset;
			for ( var t = 0; t < numTentacles; t++ ) {
				tentacles[t].path.position = this.location.clone();
			}
		}
	}
	
}

// ---- Jelly Class END
// -------------------------------------



// -------------------------------------
// ---- Tentacle Class BEGIN

function Tentacle() {
	this.head	= new Segment();
	
	this.path				= new Path();
	var numSegments 		= parseInt(Math.random() * 5 + 10);
	var segmentLength 		= Math.random() * 10 + 5;
	
	var pathTip				= new Path.Circle( new Point(0, 0), 2.5 );
	pathTip.style 			= tentacleTipStyle;
	//pathTip.opacity 		= 0.7;
		
	
	this.init = function() {
		for ( var i = 0; i < numSegments; i++ ) {
			this.path.add( new Point( 0, i * segmentLength ) );
		}
		this.path.style 	= tentacleStyle;
		this.head			= this.path.segments[0];
	};
	//this.path.opacity = 0.8;
	
	
	// Use simple IK motion
	this.update = function( orientation ) {
		this.path.segments[1].point = this.head.point;
		
		var dx 		= this.head.point.x - this.path.segments[1].point.x;
		var dy 		= this.head.point.y - this.path.segments[1].point.y;
		var angle 	= Math.atan2( dy, dx ) + (orientation * (Math.PI / 180));
		angle += Math.PI / 2;
		
		this.path.segments[1].point.x += Math.cos( angle );
		this.path.segments[1].point.y += Math.sin( angle );
		
		for ( var i = 2; i < numSegments; i++ ) {
			var pt = new Point( (this.path.segments[i].point.x - this.path.segments[i-2].point.x), (this.path.segments[i].point.y - this.path.segments[i-2].point.y) );
			var len = pt.length;
			if ( len > 0.0 ) {
				this.path.segments[i].point.x = this.path.segments[i-1].point.x + (pt.x * segmentLength) / len;
				this.path.segments[i].point.y = this.path.segments[i-1].point.y + (pt.y * segmentLength) / len;
			}
		}
		
		pathTip.position.x = this.path.segments[numSegments-1].point.x;
		pathTip.position.y = this.path.segments[numSegments-1].point.y;
	};
	
}

// ---- Tentacle Class END
// -------------------------------------



// -------------------------------------
// ---- Particle Class BEGIN

function Particle( id, location ) {
	location.x += Math.random() * 30;
	location.y += Math.random() * 30;
	
	this.id 			= id;
	this.isDead 		= false;
	this.path 			= new Path.Circle( location, Math.random() * 3 + 2 );
	this.path.style 	= particleStyle;
	this.path.opacity 	= 0.8;
	
	var lifeSpan 		= 250;
	var age 			= lifeSpan;
	var waveFactor		= Math.random() * 2 + 2;
	
	
	this.update = function( evt ) {
		this.path.position.x += Math.cos( evt.time * waveFactor );
		this.path.position.y -= 0.8;
		
		this.path.opacity = age / lifeSpan;
		age--;
		if ( age === 0 ) {
			this.isDead = true;
			this.path.remove();
		}
		
	}
}

// ---- Particle Class END
// -------------------------------------
