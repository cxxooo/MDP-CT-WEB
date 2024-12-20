import './style.css'
 
let order = 3;

let sonnetData = [];
let ngrams = {};
const startBtn = document.getElementById('start');
const generateBtn = document.getElementById('generate')
const output = document.getElementById('output')
let ngramsOverWords = document.getElementById('ngrams').checked

const saveBtn = document.getElementById('save')
const archive = document.getElementById('record')

const humanIconImg = document.getElementById('rightIcon')
const robotIconImg = document.getElementById('leftIcon')

let countHumanTextArrayLength = 0;
let countSaveNum = 0;
let allHumanText = [];

function outputHumanPolish(){
  let inputPolish = document.getElementById('fix').value;
  archive.innerHTML += '<br>' + inputPolish;
  
  humanIconImg.src = "./img/robotIcon.png";
  
  [countSaveNum] = inputPolish;
  countHumanTextArrayLength +=1;
  countSaveNum +=1;
  console.log(allHumanText);

  for( let i = 0; i< countHumanTextArrayLength; i++){
    allHumanText[i] = inputPolish;
    console.log(allHumanText[i]);
  }
  // console.log(allHumanText);
  processText(allHumanText)
}


function fetchText(){
  fetch("https://poetrydb.org/author,title/Shakespeare;Sonnet")
  .then(response => response.json())
  .then(sonnets =>{
    sonnets.forEach(sonnet => {
      sonnet.lines.forEach(line =>{
        line = line.toLowerCase().replace(/["'`,!?;.:]/g, '');
        if(!line) return //skip empty lines
        sonnetData.push(line);
      })
    })

    processText(sonnetData);
  })
  .catch(error => console.log(error))
}

function processText(_inputarray){
  _inputarray.forEach(line =>{
    if(ngramsOverWords){ // using ngrams
      for(let i =0; i<line.length - order;i++){
        let gram = line.substring(i, i+3)
        if(!ngrams[gram])ngrams[gram]=[] // make a library of every ngrams
        ngrams[gram].push(line.charAt(i+order))
      }
    }
    else{//using words

    }
  })
  console.log(ngrams)  
}

function generateText(){
  if(ngramsOverWords){
    generateTextUsingNgrams();
    humanIconImg.src = "./img/humanIcon.png"
  }
  else{
    generateTextUsingWords()
  }
}

function generateTextUsingNgrams(){
  let currentGram
  let ngramKeys = Object.keys(ngrams);

  for(let j = 0; j < 4; j++){
    if(j == 0 ) {
      currentGram = document.getElementById('prompt').value.substring(0,order);
    }
    else {
      currentGram = ngramKeys[Math.floor(Math.random()*ngramKeys.length)]
    }

    let result = currentGram;
    for(let i = 0; i<50;i++){
      let possibilities = ngrams[currentGram];
      if(!possibilities) break;
      let next = possibilities[Math.floor(Math.random()*possibilities.length)];
      result += next;
      currentGram = result.substring(result.length - order, result.length)
    }
    output.innerHTML += '<br>' + result;
  }

  output.innerHTML += "<br/><br><strong>What does that make you think about?";
  
}


function generateTextUsingWords(){

}

startBtn.addEventListener('click', fetchText)
generateBtn.addEventListener('click', generateText)
saveBtn.addEventListener('click', outputHumanPolish)

// Made me think about rain
// And sadness
// And pretty flowers