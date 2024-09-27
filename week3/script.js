let DOMsection = document.getElementById("DOMoptions")
let newParagraph = document.createElement("p")
let buttonColor = document.getElementById("btnColorChange")
let toggleImage = document.getElementById("btnImageToggle")
let galleryIMG = document.getElementById("imageGallery").children[0]
//DOMsection.style.backgroundColor = '#BEC23F'
console.log(galleryIMG)

newParagraph.innerText = "Hello World"

DOMsection.appendChild(newParagraph)

let imageToggle = function () {
    //console.log("fire!")

    //galleryIMG.src = "images/gallery2.jpg"

    //console.log(galleryIMG.src)

    // if (galleryIMG.src.includes("gallery1")) {
    //     console.log("gallery1")
    //     galleryIMG.src = "images/gallery2.jpg"
    // }
    // else {
    //     console.log("gallery2")
    //     galleryIMG.src = "images/gallery1.jpg"
    // }

    galleryIMG.src.includes("gallery1") ? (galleryIMG.src = "images/gallery2.jpg") : (galleryIMG.src = "images/gallery1.jpg")
}

toggleImage.addEventListener("click", imageToggle)

buttonColor.addEventListener("click", function () {
    let redPortion = Math.random() * 255
    let greenPortion = Math.random() * 255
    let bluePortion = Math.random() * 255

    let randomColor = "rgb(" + redPortion + ", " + greenPortion + ", " + bluePortion + ")"
    console.log(randomColor)
    DOMsection.style.backgroundColor = randomColor
})
