var currTile;
var otherTile; // tile in desired place

var turns = 0;
var win = false;
let num = 0;

const images = 
[
    {source:"Silicon_Pic.png", size: 3, site: "https://www.wevolver.com/article/silicon-semiconductor"}, 
    {source:"Transistor_Pic.png", size: 4, site: "https://www.techtarget.com/whatis/definition/transistor"}, 
    {source:"PC_Pic.png", size: 5, site: "https://www.kenbak.com/"}, 
    {source:"AI_Pic.png", size: 6, site: "https://toloka.ai/blog/history-of-llms/"}];

// solved order
let imgOrderCorrect0 = // Silicon picture
[
    "00", "01", "02",
    "10", "11", "12",
    "20", "21", "22"
];
let imgOrderCorrect1 = // Transistor Picture
[
    "30", "31", "32", "33",
    "40", "41", "42", "43",
    "50", "51", "52", "53",
    "60", "61", "62", "63"
];
let imgOrderCorrect2 = // PC Picture
[
    "70", "71", "72", "73", "74",
    "80", "81", "82", "83", "84",
    "90", "91", "92", "93", "94",
    "A0", "A1", "A2", "A3", "A4",
    "B0", "B1", "B2", "B3", "B4"
];
let imgOrderCorrect3 = // AI Picture
[
    "C0", "C1", "C2", "C3", "C4", "C5",
    "D0", "D1", "D2", "D3", "D4", "D5",
    "E0", "E1", "E2", "E3", "E4", "E5",
    "F0", "F1", "F2", "F3", "F4", "F5",
    "G0", "G1", "G2", "G3", "G4", "G5",
    "H0", "H1", "H2", "H3", "H4", "H5"
];
let imgOrderTemp; // Used for temporary storage
let imgOrder; // Current Image Order

function gameStart() {
    infoText(); // Updates text for information after round is over
    startShuffle(); // Shuffles images
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
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            document.getElementById("board").append(tile);
        }
    }
    document.getElementById("refImage").src = images[num].source;
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

function dragDrop() {
    otherTile = this; // this refers to the img tile being dropped on
}

function dragEnd() {
    // meant for if one space is considered "blank"
    // if(!otherTile.src.includes("22.jpg")){
    //     return;
    // }

    // coordinates of current tile
    let currCoords = currTile.id.split("-"); // ex: "0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);
    // coordinates of desired space
    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);
    // directional movement based on rows and columns
    let moveLeft = r == r2 && c2 == c - 1;
    let moveRight = r == r2 && c2 == c + 1;
    let moveUp = r == r2 - 1 && c2 == c;
    let moveDown = r == r2 + 1 && c2 == c;
    // checks if current tile and desired space are adjacent
    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;
    // swaps images of tiles 
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
// updates order of images/tiles
function updateOrder(r, c, r2, c2) {
    let currSpot1 = r + images[num].size*c;
    let currSpot2 = r2 + images[num].size*c2;

    let tempId = imgOrder[currSpot1];
    imgOrder[currSpot1] = imgOrder[currSpot2];
    imgOrder[currSpot2] = tempId;
    console.log(imgOrder);
}
// checks if puzzle is solved after each swap
function checkSolved() {
    let order;
    // which image is being used for comparing to correct order
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
    }
    for (let i = 0; i < order.length; i++) { // actual comparison between correct order and current order
        if (imgOrder[i] != order[i]){
            break;
        }
        else if(i == order.length - 1){
            win = true;
            overlayOn();
        }
    }
}
// turns transparent overlay on after round is over
function overlayOn() {
    document.getElementById("overlay").style.display = "block";
}
// turns transparent overlay off
function overlayOff() {
    document.getElementById("overlay").style.display = "none";
}
// clears board of every "img" instance apart from the title and reference image
function resetGame() {
    // num == 4 means the "congratulations" screen is showing and the overlay should stay up
    if(num != 4){
        overlayOff();
        if(document.getElementsByTagName("img").length > 0) {
            const oldTiles = document.getElementsByTagName("img");
            for(let i = oldTiles.length-1; i > 0; i--){
                if(oldTiles[i].id != "title" && oldTiles[i].id != "refImage"){
                    oldTiles[i].remove();
                }
            }
        }
    }
    win = false;
    turns = 0;
    document.getElementById("turns").innerText = turns;
    gameStart();
}
// shuffles image positions based on correct order
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
// changes the level (if "num" goes to 5, it resets back to 0)
function lvlUp() {
    num+=1;
    if (num == 5){
        num = 0;
    }
    resetGame();
}
// changes the information shown on transparent overlay and the link
function infoText() {
    let link = document.getElementById("overlayLink");
    let text = document.getElementById("overlayText");
    switch(num){
        case 0:
            link.innerHTML = '<a href="https://www.wevolver.com/article/silicon-semiconductor" title="Silicon">Silicon</a>';
            text.firstChild.data = "Silicon is a semiconductor that has been commonly used in computers and computer components since the 1950's. For more information, click the link below."
            break;
        case 1:
            link.innerHTML = '<a href="https://www.techtarget.com/whatis/definition/transistor" title="Transistor">Transistor</a>';
            text.firstChild.data = "Transistors act like electronic switches. The earliest transistor computers needed around 200 to perform their complex operations. For more information, click the link below."
            break;
        case 2:
            link.innerHTML = '<a href="https://www.kenbak.com/" title="PC">PC</a>';
            text.firstChild.data = "The Kenbak-1 is said to be the oldest personal computer. Though this is highly debated. For more information, click the link below."
            break;
        case 3:
            link.innerHTML = '<a href="https://toloka.ai/blog/history-of-llms/" title="AI">AI</a>';
            text.firstChild.data = "Today, we have Large Language Models that are able to gather information from normal text and give a response. For more information, click the link below."
            break;
        case 4:
            link.innerHTML ='<a href="" title=""></a>';
            text.firstChild.data = "Thanks for Playing! Share this site with your friends!"
            break; 
        default:
            link.innerHTML = '<a href="https://www.wevolver.com/article/silicon-semiconductor" title="Silicon">Silicon</a>';
            text.firstChild.data = "Silicon is a semiconductor that has been commonly used in computers and computer components since the 1950's. For more information, click the link below."
    }
}
