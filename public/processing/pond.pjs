int numBoids 		= 5;

ArrayList boids 	= new ArrayList();
ArrayList foods 	= new ArrayList();

int[] pinkColors 	= new int();
int[] blueColors 	= new int();

var touches;


void setup() {
	size( window.innerWidth, window.innerHeight );
	
	//frameRate( 30 );
	
	pinkColors = [#000000, #E61961, #D8D8C0];
	blueColors = [#000000, #1693A5, #D8D8C0];
	
	
	// Create fishes
	for ( int n = 0; n < numBoids; n++ ) {
		PVector location = new PVector( random( 100, width - 100 ), random( 100, height - 100 ) );
		
		if ( n % 3 == 0 ) {
			Fish fish = new Fish( pinkColors, location, random( 1.0, 3.5 ), 0.2 );
		}
		else {
			Fish fish = new Fish( blueColors, location, random( 1.0, 3.5 ), 0.2 );
		}
		boids.add( fish );
	}
}


void draw() {
	background( 105, 210, 231, 0 );
	
	
	// Fish
	//for ( int i = boids.size() - 1; i >= 0; i-- ) {
	for ( int i = 0; i < boids.size(); i++ ) {
		Fish fish = (Fish)boids.get( i );
		fish.update();
		fish.render();
		
		// If there is any food in the pond
		if ( foods.size() > 0 ) {
			// Check if a fish is near one and apply arrive void behaviour
			//for ( int j = foods.size() - 1; j >= 0; j-- ) {
			for ( int j = 0; j < foods.size(); j++ ) {
				Food food 		= (Food)foods.get( j );
				PVector fLoc 	= food.location.get();
				PVector bLoc 	= fish.location.get();
				float d 		= bLoc.dist( fLoc );
				if ( d < 80.0 ) {
					fish.arrive( fLoc );
					if ( fish.hasArrive === true ) {
						food.isDead = true;
						fish.hasArrive = false;
					}
				}
			}
		}
	}
	
	// Food
	for ( int f = foods.size() - 1; f >= 0; f-- ) {
		Food food = (Food)foods.get( f );
		food.update();
		food.render();
		if ( food.isDead ) {
			foods.remove( f );
		}
	}
	
}


void mouseDragged() {
	// Add food
	if ( millis() % 10 == 0 ) {
		foods.add( new Food( new PVector( mouseX, mouseY ) ) );
	}
}


function touchMove( evt ) {
	// Add food
	evt.touches;
	if ( millis() % 10 == 0 ) {
		foods.add( new Food( new PVector( touches[0].pageX, touches[0].pageY ) ) );
	}
}

function touchEnd( evt ) {
	touches = undefined;
}