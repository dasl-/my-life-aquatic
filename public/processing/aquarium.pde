// Global variables
int delay = 200;
private int canvasWidth;
private int canvasHeight;
private MyCircle myCircle;
private HashMap<MyCircle> myCircles;

// Setup the Processing Canvas
void setup(){
    canvasWidth = 1200; //$(window).width();
    canvasHeight = 500; //$(window).height() - 100;
    
    size(canvasWidth, canvasHeight);
    strokeWeight( 10 );
    frameRate( 15 );

    myCircle = new MyCircle();
    myCircles = new HashMap<MyCircle>();
}

// Main draw loop
void draw(){
    // Fill canvas blue
    background(#69D2E7);

    myCircle.drawLocal();

    for (MyCircle circle : myCircles.values()) {
        circle.drawLocal();
    }
}

// Set circle's next destination
void mouseMoved(){
    myCircle.setMouseX(mouseX);
    myCircle.setMouseY(mouseY);  
}

public void increaseMyRadius() {
    myCircle.setRadius(myCircle.getRadius() + 10);
}

public void addCircle(MyCircle myCircle) {
    myCircles.put(myCircle.getId(), myCircle);
}

public MyCircle getMyCircle() {
    return myCircle;
}

public void updateRemote(int x, int y, int[] color, float radius, String id, int mouseX, int mouseY) {
    MyCircle remoteCircle = myCircles.get(id);
    if(remoteCircle == null) {
        remoteCircle = new MyCircle(x, y, color, radius, id, mouseX, mouseY);
        myCircles.put(id, remoteCircle);
    }
    else {
        //remoteCircle.setX(x);
        //remoteCircle.setY(y);
        //remoteCircle.setColor(color);
        //remoteCircle.setRadius(radius);
        remoteCircle.setMouseX(mouseX);
        remoteCircle.setMouseY(mouseY);
    }
}

class MyCircle {
    private int x;
    private int y;
    private int mouseX;
    private int mouseY;
    private int[] color = new int[3];
    private float radius;
    private String id;

    public MyCircle() {
        this.color[0] = int(random(255));
        this.color[1] = int(random(255));
        this.color[2] = int(random(255));
        this.radius = 50.0;
        this.x = int(random(canvasWidth));
        this.y = int(random(canvasHeight));
        this.id = "" + random(1000000);
        this.mouseX = 0;
        this.mouseY = 0;
    }

    public MyCircle(int x, int y, int[] color, float radius, String id, int mouseX, int mouseY) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = radius;
        this.id = id;
        this.mouseX = mouseX;
        this.mouseY = mouseY;
    }

    public void drawLocal() {
        radius += sin(frameCount / 4);
        x += (mouseX - x) / delay;
        y += (mouseY - y) / delay;

        fill(color[0], color[1], color[2]);

        // Set stroke-color white
        stroke(255); 

        ellipse(x, y, radius, radius); 
    }

    public void drawRemote() {
        fill(color[0], color[1], color[2]);
        stroke(255); 
        ellipse(x, y, radius, radius); 
    }

    public void setRadius(float radius) {
        this.radius = radius;
    }

    public float getRadius() {
        return this.radius;
    }

    public int[] getColor() {
        return this.color;
    }

    public void setColor(int[] color){
        this.color = color;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getX() {
        return this.x;
    }

    public void setY(int y) {
        this.y = y;
    }

    public int getY() {
        return this.y;
    }

    public String getId() {
        return this.id;
    }

    public int getMouseX() {
        return this.mouseX;
    }

    public void setMouseX(int mouseX) {
        this.mouseX = mouseX;
    }

    public int getMouseY() {
        return this.mouseY;
    }

    public void setMouseY(int mouseY) {
        this.mouseY = mouseY;
    }
}
