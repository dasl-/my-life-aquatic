class Bubble extends Boid {
    float diameter;
    Color mainColor;
    String id;

    Bubble(Color myColor) {
        PVector location = new PVector(int(random(0, width - 1)), height - 1);
        diameter = int(random(30, 50));
        super(location, 0.8, 0.2, new PVector(0, -1)); 
        mainColor = myColor;
    }

    void render() {
        smooth();
        stroke(mainColor);
        strokeWeight(3);
        noFill();
        ellipseMode(CENTER);
        ellipse(location.x, location.y, diameter, diameter);
    }

    void update() {
        velocity.x = random(-0.4, 0.4);
        super.update();
    }
}

