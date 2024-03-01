//header comment
//Ack: I used this sketch https://editor.p5js.org/kevinhb92/sketches/zLDDLrg_ for help making the arrows.

//declare variables
let colorPickers = []; //variable used to access the ColorPicker control
let currentColor;
let currentColorIndex = 0;
let clearButton; //variable used to access the Button control
let shapeSelector; //variable used to access the dropdown Select control
let sizeSlider; //variable used to access the Slider control
let imageSelector; //variable used to access a Select dropdown control for images
let controlsContainers; //this is an html section in the index.html file!
let sliderValue; //this is the value of the slider which sets the paintbrush size
let currentShape = "draw"; //variable to decide the shape of the paintbrush
let images = []; //collection of images that you can draw on
let currentImage; //the image selected to draw on
let selectedImage; //currently selected image
let savedArrowPosX, savedArrowPosY;
let centralVector;

let defaultColors;

//create an array of objects with two fields, file and description
//#0.1 enter the following array code into *AI* to have it explain it to you
//#0.2 Find 5 images for your theme and load them into the assets folder
let imageFiles = [
  { file: "./assets/blank.png", description: "Blank" },
  { file: "./assets/Basketball.png", description: "Basketball" },
  {
    file: "./assets/Football.png",
    description: "Football",
  },
  {
    file: "./assets/Hockey.png",
    description: "Hockey",
  },
  { file: "./assets/Lacrosse.png", description: "Lacrosse" },
  {
    file: "./assets/Soccer.png",
    description: "Soccer",
  },
];

//preload images for asynchronous web
//#1.1 enter the following code into *AI* to explain it to you
function preload() {
  for (let file of imageFiles) {
    images.push(loadImage(file.file)); //load each image
  }
} //end function preload()

//initialize variables and setup program
function setup() {
  defaultColors = ["#000000", "#03A9F4", "#4CAF50", "#FFC107", "#607D8B"];

  centralVector = createVector(0, -1);
  //update the title in the index.html file from Processing!
  let bannerDiv = select("#app-header");
  bannerDiv.html("Play Designer App"); //#2 Change to your themed title

  let canvas = createCanvas(windowWidth, windowHeight-140);
  let canvasContainer = select("#canvasContainer");
  canvas.parent("canvasContainer");

  controlsContainers = [
    select("#controlsContainer0"),
    select("#controlsContainer1"),
    select("#controlsContainer2"),
  ]; //look in the index.html file
  background(255);

  saveButton = createButton("Save").parent(controlsContainers[0]);
  saveButton.mousePressed(saveCanvas);

  //create a clear button
  clearButton = createButton("Clear").parent(controlsContainers[1]);
  clearButton.mousePressed(onImageSelect); //assign a function

  //create a shape selector dropdown
  //*** createSelect() ***//
  shapeSelector = createSelect().parent(controlsContainers[1]);
  //add the dropdown options!
  shapeSelector.option("draw");
  shapeSelector.option("arrow");
  shapeSelector.option("circle");
  shapeSelector.option("square");
  shapeSelector.option("triangle");
  shapeSelector.option("diamond");

  //create a size slider
  sizeSlider = createSlider(1, 100, 5).parent(controlsContainers[0]);
  sizeSlider.class("slider");
  sizeSlider.style("appearance", "none");
  sizeSlider.style("background", color(200, 200, 200));
  sizeSlider.style("border-radius:15px");

  //create a paragraph for slider value display
  sliderValueDisplay = createSpan("size: " + sizeSlider.value()).parent(
    controlsContainers[0]
  );
  sliderValueDisplay.style("margin-left", "10px"); //add margin for spacing
  sliderValueDisplay.style("flex-shrink", "0"); //prevent the span from shrinking

  //*** getting value from slider to label ***//
  sizeSlider.input(() => {
    sliderValueDisplay.html("size: " + sizeSlider.value());
  });

  //create an image selector dropdown
  imageSelector = createSelect().parent(controlsContainers[1]); //event handler for selection
  //populate image selector (assuming you have an array of image names)
  //populate the selector with options using descriptions
  imageFiles.forEach((file, index) => {
    imageSelector.option(file.description, index.toString());
  });

  //imageSelector.option("blank");
  imageSelector.changed(onImageSelect); //create a color picker

  defaultColors.forEach((selectedColor, index) => {
    colorPickers.push(createColorPicker(selectedColor).parent(controlsContainers[2])
    );
    colorPickers[index].mousePressed(() => {
      currentColorIndex = index;
    });
  });
} //end function setup()

//use variables to have fun
function draw() {
  currentColor = colorPickers[currentColorIndex].value();
  if (mouseIsPressed && mouseY < height + 10) {
    drawShape();
  }
} //end function draw()

//draw the selected shape
//*** drawShape() ***//
function drawShape() {
  let size = sizeSlider.value();
  fill(currentColor);
  noStroke();

  //*** switch ***//
  switch (shapeSelector.value()) {
    case "draw":
      stroke(currentColor);
      strokeWeight(size);
      line(pmouseX, pmouseY, mouseX, mouseY);
      break;
    case "circle":
      ellipse(mouseX, mouseY, size, size);
      break;
    case "square":
      rect(mouseX, mouseY, size, size);
      break;
    case "triangle":
      triangle(
        mouseX,
        mouseY,
        mouseX + size,
        mouseY,
        mouseX + size / 2,
        mouseY - size
      );
      break;
    case "diamond":
      quad(
        mouseX,
        mouseY - size / 2,
        mouseX + size / 2,
        mouseY,
        mouseX,
        mouseY + size / 2,
        mouseX - size / 2,
        mouseY
      );
      break;
  }
} //end function drawShape()

//clear the canvas
function clearCanvas() {
  clear();
  background(255);
} //end function clearCanvas()

//function to handle image selection - this function is mapped to the control
function onImageSelect() {
  const selectedIndex = parseInt(imageSelector.value(), 10);
  selectedImage = images[selectedIndex];
  clearCanvas();
  //displaying the image at width, height below changes the image.
  //build an algorithm to set the height or width in the resize function.
  image(selectedImage, 0, 0, width, height);
} //end function onImageSelect()

function mousePressed() {
  if (
    mouseX > 0 &&
    mouseX < width &&
    mouseY > 0 &&
    mouseY < height &&
    shapeSelector.value() == "arrow"
  ) {
    savedArrowPosX = mouseX;
    savedArrowPosY = mouseY;
  }
}

function mouseReleased() {
  if (
    mouseX > 0 &&
    mouseX < width &&
    mouseY > 0 &&
    mouseY < height &&
    shapeSelector.value() == "arrow"
  ) {
    stroke(currentColor);
    strokeWeight(sizeSlider.value());
    let a = { x1: savedArrowPosX, y1: savedArrowPosY, x2: mouseX, y2: mouseY };
    drawArrow(a);
  }
}

function drawArrow(arrow) {
  push(); // saves the current display settings
  let normalizedDirection = createVector(
    arrow.x2 - arrow.x1,
    arrow.y2 - arrow.y1
  );
  normalizedDirection.normalize();
  let angle = centralVector.angleBetween(normalizedDirection);

  line(arrow.x1, arrow.y1, arrow.x2, arrow.y2);
  translate(arrow.x2, arrow.y2); // centers the arrow's head
  rotate(angle); //rotates canvas to have the arrow face directly up
  triangle(6, 0, 0, -12, -6, 0); // draws arrowhead facing up

  pop(); // restores the display settings from push()
}
