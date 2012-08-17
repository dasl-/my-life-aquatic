## Summary
![my life aquatic](http://i.imgur.com/AZWT5.png "my life aquatic")

[my life aquatic](http://mylifeaquatic.herokuapp.com/) is a shared aquarium using Processing.js and web sockets. Sound effects with buzz.js. To our knowledge, this is the first time Processing.js has been combined with web sockets. Each user that visits the website will be granted a fish to control. Simultaneous visitors to the site will be able to see and interact with each other's fish in their browsers. This proof of concept shows promise for the future of multiplayer in browser games built using Processing.js.

Fish constantly get skinnier. To avoid starving, eat the food that periodically appears in the aquarium.

my life aquatic is featured on the [Processing.js exhibition page](http://processingjs.org/exhibition/) and is home to ~100 hungry fishies daily.

## Technical Notes of Interest

The code for the Processing files is located [here](https://github.com/davidleibovic/my-life-aquatic/tree/master/public/processing). Of particular interest would be the [pond](https://github.com/davidleibovic/my-life-aquatic/blob/master/public/processing/pond.pjs) and [fish](https://github.com/davidleibovic/my-life-aquatic/blob/master/public/processing/Fish.pjs) files.

No code for this game is run on the server. All information about game state is transmitted through the web socket. In particular, each fish's owner sends information about his fish to each other player in the aquarium.

There are advantages and disadvantages to this approach of not maintaining a canonical game state on the server. An advantage is that each player perceives his fish to be very responsive to his mouse movements, as mouse position does not need to be sent to the server first to be validated. When a player moves his mouse, his fish immediately responds on his screen. Compare this with other multiplayer games such as Warcraft III or Starcraft, in which movement commands must be first sent to the server before a player's own units begin to move, resulting in a small lag. A disadvantage to this approach of not maintaining a canonical game state on the server is that keeping game state in sync across all players becomes hard. A player's representation of his own fish will always be slightly "ahead" of that fish's location on other players' screens, due to network lag in transmitting his mouse movements through the web socket. As an exacting level of precision is not necessary to this game, the approach used was deemed optimal.

We use Pusher as our websockets provider. Pusher limits the number of messages that can be transmitted to 10 per second per client. The aquarium maxes out the Pusher message rate. Thus, if the aquarium had five simultaneous users, each user would be receiving 40 messages per second and sending 10 messages per second.

In the Pusher messages, we transmit mouse x,y coordinates so that each player can run his own simulation of another player's fish movement given a sequence of received x,y coordinates. Let us define an aquarium with two players, `A` and `B`. Player `A`'s mouse could easily cover 100+ different x,y coordinates per second if player `A` is actively moving his mouse. As we are rate limited to sending 10 messages per second via Pusher, only 10 of these x,y coordinates will be transmitted to player `B`. Thus, player `B`'s representation of player `A`'s fish could get arbitrarily out of sync with player `A`'s representation of his own fish since player `A`'s fish movement simulation of his own fish is acting on all 100+ x,y coordinates in sequence, while player `B`'s representation of this fish is only acting on at most 10 x,y coordinates in sequence per second. This is bad if we value keeping the positions of the fish in sync across aquarium players.

To remedy this situation, we use client side correction:

```java
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
```

Each player's representation of another player's fish has a `canonicalUnModdedLocation` and an `unModdedLocation`. Let us define an aquarium with two players, `A` and `B`. Player `B`'s representation of player `A`'s fish will have a `canonicalUnModdedLocation` (the location of player `A`'s fish in player `A`'s aquarium) and an `unModdedLocation` (the location of player `A`'s fish in player `B`'s aquarium).

With each rendering of the aquarium, player `B` will apply client side correction to his representation of player `A`'s fish so that it approximates the fish's `canonicalUnModdedLocation`. Game state out of sync issues across aquarium players become negligible with this correction.

The astute reader may wonder why we use the term `UnModded` in our variable names. Recall that fish wrap around the aquarium. A fish that swims past the right edge of the aquarium will soon be seen entering the aquarium from the left side. A fish that swims past the bottom edge of the aquarium will soon be seen entering the aquarium from the top. The in order for Processing to render the fish, it needs their x and y coordinates modulo the width and height of the aquarium respectively. Now, consider what the client side correction algorithm would do when player `A` swims his fish past the right edge of the screen. At any time `t`, Player `B`'s representation of player `A`'s fish will be slightly behind player `A`'s representation of player `A`'s fish, due to network latency. Let us say the width of the aquarium is 1000px. If we transmitted only the modded locations of player `A`'s fish, then when player `A`'s fish wraps around to the left side of the screen, it would transmit a location of 0 for the x coordinate. Meanwhile, player `B`'s representation of player `A`'s fish is slightly behind at perhaps an x coordinate of 997. Upon receiving the canonical location of player `A`'s fish of x = 0, player `B`'s client side correction would kick into overdrive for his representation of player `A`'s fish. There would be a perceived location discrepancy of 997 pixels, and player `B` would see his representation of player `A`'s fish swim wildly backward (from right to left) across the screen, rather than continuing to wrap around the screen on its actual trajectory from left to right.

By transmitting the unmodded coordinates of player `A`'s fish location to player `B`, instead of sending x = 0, as the fish entered from the left side of the aquarium, we would send x = 1001, and the client side correction would work as desired. In order to render the fish on screen, Processing of course needs the x location modulo 1000, which we can do after the client side correction has been applied.

In the aquarium, fish must travel a distance of `l` off the edge of the aquarium before appearing on the opposite edge of the aqiarum, where `l` is the fish's length. This adds another layer of complexity to our algorithm, as we must implement our own rounding algorithm to compute a fish's unmodded location. For example:

```java
private int roundToNearestRightBoundary(int currentX) {
	int nearestRightBoundary;
	int roundingWidth = width + 2 * bodySizeW;
	int adjustedCurrentX = currentX + 2 * bodySizeW;
	float multiple = adjustedCurrentX / (float) roundingWidth;
	if(ceil(multiple) - multiple < multiple - floor(multiple)) {
		nearestRightBoundary = ceil(multiple) * roundingWidth - 2 * bodySizeW;
	}
	else {
		nearestRightBoundary = floor(multiple) * roundingWidth - 2 * bodySizeW;
	}
	return nearestRightBoundary
}
```

Ah, the joys of keeping game state in sync across all players while compensating for network lag!