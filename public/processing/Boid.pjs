class Boid {
	
	PVector location;
	PVector velocity;
	PVector acceleration;
	
	float maxForce;
	float maxSpeed;
	float wanderTheta;
	
	boolean hasArrive;
	
	
	Boid( PVector _location, float _maxSpeed, float _maxForce ) {
		location 		= _location.get();
		
		maxSpeed 		= _maxSpeed;
		maxForce 		= _maxForce;
		
		//velocity 		= new PVector( 0, 0 );
		velocity 		= new PVector( random( -maxSpeed, maxSpeed ), random( -maxSpeed, maxSpeed ) );
		acceleration 	= new PVector( 0, 0 );
		
		wanderTheta		= 0;
		
		hasArrive 		= false;
	}
	
	
	void update() {
		velocity.add( acceleration );
		velocity.limit( maxSpeed );
		
		location.add( velocity );
		
		acceleration.mult( 0 );
	}
	
	
	void checkBorders( float _dist ) {
		if ( location.x < -_dist ) {
			location.x = width + _dist;
		}
		if ( location.x > width + _dist ) {
			location.x = -_dist;
		}
		
		if ( location.y < -_dist ) {
			location.y = height + _dist;
		}
		if ( location.y > height + _dist ) {
			location.y = -_dist;
		}
	}
	
	
	void debugRender() {
		noStroke();
		fill( 255, 0, 0 );
		ellipse( location.x, location.y, 10, 10 );
	}
	
	
	void run() {
		update();
		checkBorders( 200 );
		debugRender();
	}
	
	
	PVector steer( PVector _target, boolean _slowdown ) {
		PVector steer;
		PVector desired = PVector.sub( _target, location );
		
		float dist = desired.mag();
		
		if ( dist > 0 ) {
			desired.normalize();
			
			if ( _slowdown && dist < 60 ) {
				desired.mult( maxSpeed * (dist / 60) );
				if ( dist < 10 ) {
					hasArrive = true;
				}
			}
			else {
				desired.mult( maxSpeed );
			}
			
			steer = PVector.sub( desired, velocity );
			steer.limit( maxForce );
		}
		else {
			steer = PVector( 0, 0 );
		}
		
		return steer;
	}
	
	
	void seek( PVector _target ) {
		acceleration.add( steer( _target, false ) );
	}
	
	
	void arrive( PVector _target ) {
		acceleration.add( steer( _target, true ) );
	}
	
	
	void flee( PVector _target ) {
		acceleration.sub( steer( _target, false ) );
	}
	
	
	void wander() {
		float wanderR 	= 5;
		float wanderD 	= 100;
		float change 	= 0.05;
		
		wanderTheta += random( -change, change );
		
		PVector circleLocation = velocity.get();
		circleLocation.normalize();
		circleLocation.mult( wanderD );
		circleLocation.add( location );
		
		PVector circleOffset = new PVector( wanderR * cos( wanderTheta), wanderR * sin( wanderTheta ) );
		PVector target= PVector.add( circleLocation, circleOffset );
		
		seek( target );
	}
	
	
	void evade( PVector _target ) {
		float lookAhead = location.dist( _target ) / (maxSpeed * 2);
		PVector predictedTarget = new PVector( _target.x - lookAhead, _target.y - lookAhead );
		flee( predictedTarget );
	}
	
	
}

