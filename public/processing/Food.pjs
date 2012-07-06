class Food {
	
	PVector location;
	PVector velocity;
	
	int age;
	int ageSpan;
	int color;
	int[] colours = new int();
	
	int numSides	= 8;
	float[][] verts = new float[numSides][2];
	
	boolean isDead;
	
	
	
	Food( PVector _location ) {
		location 	= _location;
		velocity 	= new PVector( random( -1, 1 ), random( -1, 1 ) );
		velocity.div( 2 );
		
		age 		= 0;
		ageSpan 	= 300; //random( 100, 200 );
		
		colors 		= [#C96164, #E8C64D, #9EB53F, #5D966C];
		int c 		= int(random( 4 ));
		color 		= colors[c];
		
		isDead		= false;
		
		float k = TWO_PI / float(numSides);
		for ( int i = 0; i < numSides; i++ ) {
			verts[i][0] = cos( k * i ) * random( 3, 15 );
			verts[i][1] = sin( k * i ) * random( 3, 15 );
		}
	}
	
	
	void update() {
		location.add( velocity );
		
		age++;
		if ( age >= ageSpan  ) {
			isDead = true;
		}
	}
	
	
	void render() {
		noStroke();
		fill( color );
		pushMatrix();
		translate( location.x, location.y );
		scale( 1.5 - age / ageSpan );
		beginShape( TRIANGLE_FAN );
		for ( int i = 0; i < numSides; i++ ) {
			vertex( verts[i][0], verts[i][1] );
		}
		endShape();
		popMatrix();
	}
	
}