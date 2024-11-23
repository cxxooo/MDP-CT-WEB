var windowHeight;
var windowWidth;
var canvasWidth;
var canvasHeight;
let fontCeliasMedium;
var colorBackground;
var h;
var m;
var s;
var hPrev;
var mPrev;
var sPrev;
var time;
var randomWord;
var rhymeHourTxt;
var rhymeMinTxt;
var rhymeSecTxt;
var rhymesSec;
var rhymesMin;
var rhymesHour;


function preload() {
  fontCeliasMedium = loadFont('assets/fonts/Celias-Medium.otf');
  disableScrolling();
}

//we don't need touches so disable them - this stops the page rubberbanding on iOS
function handleTouchMove(e) {
  e.preventDefault();
}

function disableScrolling() {
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
}

function enableScrolling() {
  document.removeEventListener('touchmove', handleTouchMove, { passive: false });
}

function setup() {
  colorMode(HSB);
  sPrev = -1;
  colorBackground = color(15, 100, 100);
  drawCanvasToWindowSize();
  createCanvas(canvasWidth, canvasHeight, WEBGL);
}

function draw() {
  drawCanvasToWindowSize();
  drawClock();
}

function drawCanvasToWindowSize() {
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;
  background(colorBackground);
}

function drawClock() {

  //get the current time, turn it into words
  h = hour();
  m = minute();
  s = second();
  if (m < 10) {
    time = convertNumberToWords(h) + '\n' + "zero " + convertNumberToWords(m) + '\n' + convertNumberToWords(s);
  } else {
    time = convertNumberToWords(h) + '\n' + convertNumberToWords(m) + '\n' + convertNumberToWords(s);
  }

  //draw the normal clock
  fill(255);
  textSize(windowWidth / 13);
  textAlign(RIGHT);
  textFont(fontCeliasMedium);
  text(time, 0, -windowWidth/12);

  //draw the rhyme clock
  fill(0);
  textAlign(LEFT);
  textFont(fontCeliasMedium);
  text(rhymeHourTxt + '\n' + rhymeMinTxt + '\n' + rhymeSecTxt, 0, -windowWidth/12);
  
  //only change the text if the time has changed
  if (h != hPrev) {
    rhymeHour();
    hPrev = h;
  }
  if (m != mPrev) {
    rhymeMinute();
    mPrev = m;
  }
  if (s != sPrev) {
    rhymeSecond();
    //if we didn't get any rhymes for hour or minute, try again
    if (rhymeMinTxt == "um...") {
      //console.log("trying min again");
      rhymeMinute();
    }
    if (rhymeHourTxt == "um...") {
      //console.log("trying hour again");
      rhymeHour();
    }
    sPrev = s;
  }
  
}

//get the rhymes for the hour, minute and second

function rhymeHour() {
  rhymesHour = RiTa.rhymes(convertNumberToWords(h));
  rhymesHour.then(function(result) {
    if (result.length > 0) {
      rhymeHourTxt = result[Math.floor(random(0, result.length))];
    } else {
      rhymeHourTxt = "um...";
    }
  });
}

function rhymeMinute() {
  rhymesMin = RiTa.rhymes(convertNumberToWords(m));
  rhymesMin.then(function(result) {
    if (result.length > 0) {
      rhymeMinTxt = result[Math.floor(random(0, result.length))];
    } else {
      rhymeMinTxt = "um...";
    }
  });
}

//original test
function rhymeSecond() {
  rhymesSec = RiTa.rhymes(convertNumberToWords(s));
  rhymesSec.then(function(result) {
    if (result.length > 0) {
      rhymeSecTxt = result[Math.floor(random(0, result.length))];
    } else {
      rhymeSecTxt = "um...";
    }
  });
}

//error test
// function rhymeSecond() {
//   //rhymesSec = RiTa.rhymes(convertNumberToWords(s));
//   RiTa.alliterations("cat", {limit: 10});
//   rhymesSec.then(function(result) {
//     if (result.length > 0) {
//       rhymeSecTxt = result[Math.floor(random(0, result.length))];
//     } else {
//       rhymeSecTxt = "um...";
//     }
//   });
// }

//test1
// function rhymeSecond() {
//  rhymeSecTxt = RiTa.randomWord();
//  console.log(rhymeSecTxt)
// }

// original test
// function rhymeSecond() {
//   rhymesSec = RiTa.rhymes(convertNumberToWords(s));
//   rhymesSec.then(function(result) {
//     if (result.length > 0) {
//       rhymeSecTxt = result[Math.floor(random(0, result.length))];
//     } else {
//       rhymeSecTxt = "um...";
//     }
//   });
// }

// map numbers to words
const numbersToWords = {
  0: "zero",
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
  11: "eleven",
  12: "twelve",
  13: "thirteen",
  14: "fourteen",
  15: "fifteen",
  16: "sixteen",
  17: "seventeen",
  18: "eighteen",
  19: "nineteen",
  20: "twenty",
  30: "thirty",
  40: "forty",
  50: "fifty",
  60: "sixty",
  70: "seventy",
  80: "eighty",
  90: "ninety",
};


function convertNumberToWords(number) {
  // if number present in object no need to go further
  if (number in numbersToWords) return numbersToWords[number];

  // Initialize the words variable to an empty string
  let words = "";

  // If the number is greater than or equal to 100, handle the hundreds place (ie, get the number of hundres)
  if (number >= 100) {
    // Add the word form of the number of hundreds to the words string
    words += convertNumberToWords(Math.floor(number / 100)) + " hundred";

    // Remove the hundreds place from the number
    number %= 100;
  }

  // If the number is greater than zero, handle the remaining digits
  if (number > 0) {
    // If the words string is not empty, add "and"
    if (words !== "") words += " and ";

    // If the number is less than 20, look up the word form in the numbersToWords object
    if (number < 20) words += numbersToWords[number];
    else {
      // Otherwise, add the word form of the tens place to the words string
      //if number = 37, Math.floor(number /10) will give you 3 and 3 * 10 will give you 30
      words += numbersToWords[Math.floor(number / 10) * 10];

      // If the ones place is not zero, add the word form of the ones place
      if (number % 10 > 0) {
        words += "" + numbersToWords[number % 10];
      }
    }
  }

  // Return the word form of the number
  return words;
}


function windowResized() {
  drawCanvasToWindowSize();
  resizeCanvas(canvasWidth, canvasHeight);
}



