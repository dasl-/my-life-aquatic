class Flagellum {
	
	int numNodes;
	
	float[][] spine;
	
	float MUSCLE_RANGE 	= 0.15;
	float muscleFreq	= 0.08;
	
	float sizeW, sizeH;
	float spaceX, spaceY;
	float theta;
	float count;
	
	
	
	Flagellum( float _sizeW, float _sizeH, int _numNodes ) {
		
		sizeW		= _sizeW;
		sizeH		= _sizeH;
		
		numNodes	= _numNodes;
		
		spine 		= new float[numNodes][2];
		
		spaceX 		= sizeW / float(numNodes + 1);
		spaceY 		= sizeH / 2.0;
		
		count 		= 0;
		theta 		= PI;
		thetaVel 	= 0;
		
		
		// Initialize spine positions
		for ( int n = 0; n < numNodes; n++ ) {
			float x	= spaceX * n;
			float y = spaceY;
			
			spine[n][0] = x;
			spine[n][1] = y;
		}
	}
	
	
	void swim() {
		spine[0][0] = cos( theta );
		spine[0][1] = sin( theta );
		
		count += muscleFreq;
		float thetaMuscle = MUSCLE_RANGE * sin( count );
		
		spine[1][0] = -spaceX * cos( theta + thetaMuscle ) + spine[0][0];
		spine[1][1] = -spaceX * sin( theta + thetaMuscle ) + spine[0][1];
		
		for ( int n = 2; n < numNodes; n++ ) {
			float x	= spine[n][0] - spine[n - 2][0];
			float y = spine[n][1] - spine[n - 2][1];
			float l = sqrt( (x * x) + (y * y) );
			
			if ( l > 0 ) {
				spine[n][0] = spine[n - 1][0] + (x * spaceX) / l;
				spine[n][1] = spine[n - 1][1] + (y * spaceX) / l;
			}
		}
	}
	
	
	void debugRender() {
		for ( int n = 0; n < numNodes; n++ ) {
			stroke( 0 );
			if ( n < numNodes - 1 ) {
				line( spine[n][0], spine[n][1], spine[n + 1][0], spine[n + 1][1] );
			}
			fill( 90 );
			ellipse( spine[n][0], spine[n][1], 6, 6 );
		}
	}
	
}