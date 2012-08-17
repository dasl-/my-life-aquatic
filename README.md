## Summary
[my life aquatic](http://mylifeaquatic.herokuapp.com/) is a shared aquarium using Processing.js and web sockets. Sound effects with buzz.js. To our knowledge, this is the first time Processing.js has been combined with web sockets. Each user that visits the website will be granted a fish to control. Simultaneous visitors to the site will be able to see and iteract with each other's fish in their browsers. This proof of concept shows promise for the future of multiplayer in browser games built using Processing.js.

Fish constantly get skinnier. To avoid starving, eat the food that periodically appears in the aquarium.

my life aquatic is featured on the [Processing.js exhibition page](http://processingjs.org/exhibition/).

## Technical Notes of Interest

We use Pusher as our websockets provider. Pusher limits the number of messages that can be transmitted to 10 per second per client. The aquarium maxes out the Pusher message rate. Thus, if the aquarium had five simultaneous users, each user would be receiving 40 messages per second and sending 10 messages per second.

In the Pusher messages, we transmit mouse x,y coordinates so that each client can run its own simulation of another user's fish movement given a sequence of received x,y coordinates. The fish's owner's mouse could easily cover 100+ different x,y coordinates per second if the fish's owner is actively moving his mouse. As we are rate limited to sending 10 messages per second via Pusher, only 10 of these x,y coordinates will be transmitted. Another player's representation of this fish could get arbitrarily out of sync with the owner's local representation since the owner's fish movement simulation is acting on a different sequence of x,y coordinates than the remote client's fish movement simulation. This is bad if we value keeping the positions of the fish in sync across aquarium players.

To remedy this situation, we use client side correction:

	/**
	 *	client side correction to correct velocity/location discrepancies between the local
	 *	representation of a remote fish. This is called from the updateRemoteFish method
	 *	in the Pond.
	 */
	public void applyClientSideCorrection() {
		// correct location discrepancies
		PVector locationDiscrepancy = PVector.sub(canonicalUnModdedLocation, unModdedLocation);
		PVector locationCorrection = PVector.mult(locationDiscrepancy,0.1);

		location.add(locationCorrection);
		unModdedLocation.add(locationCorrection);

		// correct velocity discrepancies
		PVector velocityDiscrepancy = PVector.sub(canonicalVelocity, velocity);
		PVector velocityCorrection = PVector.mult(velocityDiscrepancy,0.5);
		velocity.add(velocityCorrection);
	}






Aside from learning about processing and web sockets, this project taught me a lot about dealing with latency issues in networked games and keeping game state in sync across all players. I implemented a client side correction algorithm to this end. The aquarium is now featured on the processing exhibition page at http://processingjs.org/exhibition/ , where it is home to upward of 100 fishies daily.