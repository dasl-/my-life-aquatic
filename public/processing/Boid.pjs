class Boid {
	
	private PVector location;

	private PVector velocity;
	private PVector acceleration;
    private PVector location;

	private float maxForce;
	private float maxSpeed;
	private float wanderTheta;
	
	private boolean hasArrive;
	
	// constructor used by fish
	public Boid( PVector _location, float _maxSpeed, float _maxForce) {
        createBoid(_location, _maxSpeed, _maxForce);
		velocity 		= new PVector( random( -maxSpeed, maxSpeed ), random( -maxSpeed, maxSpeed ) );
    }

    // constructor used by bubbles
    public Boid( PVector _location, float _maxSpeed, float _maxForce, PVector velocity) {
        this.velocity = velocity.get();
        createBoid(_location, _maxSpeed, _maxForce);
    }

    private void createBoid(PVector _location, float _maxSpeed, float _maxForce) {
		location 		= _location.get();
		maxSpeed 		= _maxSpeed;
		maxForce 		= _maxForce;
		acceleration 	= new PVector( 0, 0 );
		wanderTheta		= 0;
		hasArrive 		= false;
	}
	
	protected void update() {
		velocity.add(acceleration);
		velocity.limit(maxSpeed);
		location.add(velocity);
		acceleration.mult(0);
	}
	
	protected void debugRender() {
		noStroke();
		fill(255, 0, 0);
		ellipse(location.x, location.y, 10, 10);
	}
	
	private PVector steer( PVector _target, boolean _slowdown ) {
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
	
	protected void seek(PVector _target) {
		acceleration.add( steer( _target, false ) );
	}
	
	protected void arrive( PVector _target ) {
		acceleration.add( steer( _target, true ) );
	}
	
	protected void flee( PVector _target ) {
		acceleration.sub( steer( _target, false ) );
	}
	
	protected void wander() {
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
	
	protected void evade( PVector _target ) {
		float lookAhead = location.dist( _target ) / (maxSpeed * 2);
		PVector predictedTarget = new PVector( _target.x - lookAhead, _target.y - lookAhead );
		flee( predictedTarget );
	}

    public float getMaxSpeed() {
        return maxSpeed;
    }

    public float getMaxForce() {
        return maxForce;
    }

    public PVector getVelocity() {
    	return velocity;
    }

    public void setVelocity(PVector velocity) {
    	this.velocity = velocity;
    }
	
    public PVector getLocation() {
    	return this.location;
    }
}

