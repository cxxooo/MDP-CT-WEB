import './style.css'
 
let order = 3;
let ngrams = {};
const startBtn = document.getElementById('start');
const generateBtn = document.getElementById('generate')
const output = document.getElementById('output')
let ngramsOverWords = document.getElementById('ngrams').checked

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
    generateTextUsingNgrams()
  }
  else{
    generateTextUsingWords()
  }
}

function generateTextUsingNgrams(){
  let currentGram = document.getElementById('prompt').value.substring(0,order);
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

function generateTextUsingWords(){

}

startBtn.addEventListener('click', fetchAndProcessText)
generateBtn.addEventListener('click', generateText)