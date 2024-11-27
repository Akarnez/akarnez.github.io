// var rows = 3;
// var cols = 3;

var currTile;
var otherTile; // blank tile

var turns = 0;
var win = false;
let correct = 0;
let num = 0;

const images = 
[
    {source:"Silicon_Pic.png", size: 3}, 
    {source:"Transistor_Pic.png", size: 4}, 
    {source:"PC_Pic.png", size: 5}, 
    {source:"AI_Pic.png", size: 6}];

// var successShow = document.getElementById("success");
// resetBtn.addEventListener("click", );

// solved order
let imgOrderCorrect0 = 
[
    "00", "01", "02",
    "10", "11", "12",
    "20", "21", "22"
];
let imgOrderCorrect1 = 
[
    "30", "31", "32", "33",
    "40", "41", "42", "43",
    "50", "51", "52", "53",
    "60", "61", "62", "63"
];
let imgOrderCorrect2 = 
[
    "70", "71", "72", "73", "74",
    "80", "81", "82", "83", "84",
    "90", "91", "92", "93", "94",
    "A0", "A1", "A2", "A3", "A4",
    "B0", "B1", "B2", "B3", "B4"
];
let imgOrderCorrect3 = 
[
    "C0", "C1", "C2", "C3", "C4", "C5",
    "D0", "D1", "D2", "D3", "D4", "D5",
    "E0", "E1", "E2", "E3", "E4", "E5",
    "F0", "F1", "F2", "F3", "F4", "F5",
    "G0", "G1", "G2", "G3", "G4", "G5",
    "H0", "H1", "H2", "H3", "H4", "H5"
];
let imgOrderTemp;
let imgOrder;
// const imgOrderStart =
// ["11", "10", "21",
// "00", "20", "01",
// "02", "12", "22"
// ]; // "22" is blank tile
// let imgOrder = imgOrderStart;


function gameStart() {
    // var imgOrder =
    // ["11", "10", "21",
    // "00", "20", "01",
    // "02", "12", "22"
    // ];
    // splitPic(images[0])
    startShuffle();
    // console.log(images[num].size);
    for (let r = 0; r < images[num].size; r++) {
        for (let c = 0; c < images[num].size; c++) {
            // <img id = "0-0" src = "00.jpg"
            let tile = document.createElement("img");       // creates instance of an image
            tile.style.width = ((360/images[num].size) - 2) +'px';
            tile.style.height = tile.style.width;
            tile.id = r.toString() + "-" + c.toString();    // names tile "r-c"
            tile.src = imgOrder[r + images[num].size * c] + ".png";           // defines what image to use in the defined space

            // DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            document.getElementById("board").append(tile);
        }
    }
    document.getElementById("refImage").src = images[num].source;
    // console.log(imgOrder);
    overlayOff();
}

function dragStart() {
    currTile = this; // this refers to img tile being dragged
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    otherTile = this; // this refers to the img tile being dropped on
}

function dragEnd() {
    // meant for if one space is considered "blank"
    // if(!otherTile.src.includes("22.jpg")){
    //     return;
    // }

    let currCoords = currTile.id.split("-"); // ex: "0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = r == r2 && c2 == c - 1;
    let moveRight = r == r2 && c2 == c + 1;
    let moveUp = r == r2 - 1 && c2 == c;
    let moveDown = r == r2 + 1 && c2 == c;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if(isAdjacent && !win){
        let currImg = currTile.src;
        let otherImg = otherTile.src;

        currTile.src = otherImg;
        otherTile.src = currImg;

        turns += 1;
        document.getElementById("turns").innerText = turns;
        updateOrder(r, c, r2, c2);
        checkSolved();
    }
    
}

function updateOrder(r, c, r2, c2) {
    let currSpot1 = r + images[num].size*c;
    let currSpot2 = r2 + images[num].size*c2;

    let tempId = imgOrder[currSpot1];
    imgOrder[currSpot1] = imgOrder[currSpot2];
    imgOrder[currSpot2] = tempId;
    console.log(imgOrder);
}

function checkSolved() {
    let order;
    switch(num){
        case 0:
            order = imgOrderCorrect0;
            break;
        case 1:
            order = imgOrderCorrect1;
            break;
        case 2:
            order = imgOrderCorrect2;
            break;
        case 3:
            order = imgOrderCorrect3;
            break;
        // default:
        //     order = imgOrderCorrect0;
    }
    for (let i = 0; i < order.length; i++) {
        if (imgOrder[i] != order[i]){
            break;
        }
        else if(i == order.length - 1){
            win = true;
            overlayOn();
        }
    }
}

function overlayOn() {
    document.getElementById("overlay").style.display = "block";
}

function overlayOff() {
    document.getElementById("overlay").style.display = "none";
}

function resetGame() {
    overlayOff();
    if(document.getElementsByTagName("img").length > 0) {
        const oldTiles = document.getElementsByTagName("img");
        for(let i = oldTiles.length-1; i > 0; i--){
            if(oldTiles[i].id != "title" && oldTiles[i].id != "refImage"){
                oldTiles[i].remove();
            }
        }
    }
    // for (let i = 0; i > imgOrder.length; i++) {
    //     imgOrder[i] = imgOrderStart[i];
    // }
    win = false;
    turns = 0;
    document.getElementById("turns").innerText = turns;
    if(num == 4) {
        num = 0;
    }
    gameStart();
}

function startShuffle() {
    let order;
    switch(num){
        case 0:
            order = imgOrderCorrect0;
            break;
        case 1:
            order = imgOrderCorrect1;
            break;
        case 2:
            order = imgOrderCorrect2;
            break;
        case 3:
            order = imgOrderCorrect3;
            break;
        default:
            order = imgOrderCorrect0;
    }
    imgOrder = order.map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

function lvlUp() {
    num+=1;
    resetGame();
}