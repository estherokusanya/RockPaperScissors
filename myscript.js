//Modal for About Section
var modal = document.getElementById("aboutModal");
var btn = document.getElementById("about");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
  modal.style.display = "block";
};
span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

//Modal for How to Section
var modal2 = document.getElementById("howtoModal");
var btn2 = document.getElementById("how_to");
var span2 = document.getElementsByClassName("close")[1];
btn2.onclick = function () {
  modal2.style.display = "block";
};
span2.onclick = function () {
  modal2.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
};

//Functionality for Start Button
var start_button = document.getElementById("start-button");
var stop_button = document.getElementById("stop-button");
start_button.onclick = function () {
  stop_button.style.display = "block";
  start_button.style.display = "none";
  init();
}


const URL = "https://teachablemachine.withgoogle.com/models/89LEVTIA0/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(500, 400, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();

  // append elements to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");

  window.requestAnimationFrame(loop);
}

async function loop() {
  webcam.update(); // update the webcam frame
  setInterval(predict(), 50000);
  window.requestAnimationFrame(loop);
}

var predictionTotals = [0, 0, 0];

// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    predictionTotals[i] = predictionTotals[i] + prediction[i].probability.toFixed(2);
  }
  predictionUpdate();
}


function returnPrediction() {
  if (predictionTotals[0] > predictionTotals[1] & predictionTotals[0] > predictionTotals[2]) {
    clearArray();
    return "Rock";
  }
  else if (predictionTotals[1] > predictionTotals[0] & predictionTotals[1] > predictionTotals[2]) {
    clearArray();
    return "Paper";
  }
  else {
    clearArray();
    return "Scissors";
  }
}

function clearArray(){
  predictionTotals[0]=0;
  predictionTotals[1]=0;
  predictionTotals[2]=0;
}

function predictionUpdate() {
  labelContainer.innerHTML = returnPrediction();
}
