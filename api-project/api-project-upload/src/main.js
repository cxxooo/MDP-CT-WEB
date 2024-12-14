import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
//import robotImg from './icons/robotIcon.png'
//import humanImg from './icons/humanIcon.png'



let order = 3;
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

function outputHumanPolish(){
  let inputPolish = document.getElementById('fix').value;
  archive.innerHTML += '<br>' + inputPolish;
  humanIconImg.src = "../src/icons/robotIcon.png";
  countHumanTextArrayLength +=1;
  //archiveHumanPolishText();
}

function archiveHumanPolishText(){
  let allHumanText = [];
  for( let i = 0; i< countHumanTextArrayLength; i++){
    allHumanText[i] = inputPolish;
  }
  console.log(allHumanText)
}

function fetchAndProcessText(){
  fetch("https://poetrydb.org/author,title/Shakespeare;Sonnet")
  .then(response => response.json())
  .then(sonnets =>{
    //console.log(sonnets)
    sonnets.forEach(sonnet => {
      sonnet.lines.forEach(line =>{
        line = line.toLowerCase().replace(/["'`,!?;.:]/g, '');
        if(!line) return //skip empty lines
        if(ngramsOverWords){ // using ngrams
          for(let i =0; i<line.length - order;i++){
            let gram = line.substring(i, i+3)
            if(!ngrams[gram])ngrams[gram]=[] // make a library of every ngrams

            ngrams[gram].push(line.charAt(i+order))
          }
        }else{//using words

        }
      })
    });
    console.log(ngrams)
  })// end of .then
  .catch(error => console.log(error))
}

function generateText(){
  if(ngramsOverWords){
    generateTextUsingNgrams();
    humanIconImg.src = "../src/icons/humanIcon.png"
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

startBtn.addEventListener('click', fetchAndProcessText)
generateBtn.addEventListener('click', generateText)
saveBtn.addEventListener('click', outputHumanPolish)

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))
