## Summary
[my life aquatic](http://mylifeaquatic.herokuapp.com/) is a shared aquarium using Processing.js and web sockets. Sound effects with buzz.js. To our knowledge, this is the first time Processing.js has been combined with web sockets. Each user that visits the website will be granted a fish to control. Simultaneous visitors to the site will be able to see and iteract with each other's fish in their browsers.

Fish constantly get skinnier. To avoid starving, eat the food that periodically appears in the aquarium.

my life aquatic is featured on the processing.js [exhibition page](http://processingjs.org/exhibition/).




Aside from learning about processing and web sockets, this project taught me a lot about dealing with latency issues in networked games and keeping game state in sync across all players. I implemented a client side correction algorithm to this end. The aquarium is now featured on the processing exhibition page at http://processingjs.org/exhibition/ , where it is home to upward of 100 fishies daily.