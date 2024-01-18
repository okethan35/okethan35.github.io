
let rows = 3;
let columns = 3;

//Tile you are clicking to swap
let currTile;
//other tile that will be swapped with clicked tile i.e. blank tile
let otherTile;

let turns = 0;

let imgOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
let startImgOrder = ["1", "8", "2", "4", "3", "5", "7", "6", "9"]






window.onload = function () {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            //<img id="0-0" src="cat-1.png">
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "slider_game/cat-" + startImgOrder.shift() + ".png";

            //Drag Functionality
            tile.addEventListener("dragstart", dragStart);  //click an image to drag
            tile.addEventListener("dragover", dragOver);    //moving image around while clicked
            tile.addEventListener("dragenter", dragEnter);  //dragging image onto another one
            tile.addEventListener("dragleave", dragLeave);  //dragged image leaving anohter image
            tile.addEventListener("drop", dragDrop);        //drag an image over another image, drop the image
            tile.addEventListener("dragend", dragEnd);      //after drag drop, swap the two tiles

            document.getElementById("board").append(tile);
            
        }
    }
}

function simpleShuffle(arr) {
    let tempArr = [];
    for (let i = 0; i < arr.length; i++) {
        tempArr.push(arr[i])
    }
    let randArr = [];

    while (tempArr.length > 0) {
        let randVal = Math.floor(Math.random() * (tempArr.length));
        randArr.push(tempArr[randVal]);
        tempArr.splice(randVal, 1);
    }
    return randArr;
}

    function dragStart() {
        currTile = this; //this refers to the img tile being dragged
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
        otherTile = this; //this refers to the img tile being dropped on
    }

    function dragEnd() {
        if (!otherTile.src.includes("cat-9.png")) {
            return;
        }

        let currCoords = currTile.id.split("-"); //ex) "0-0" -> ["0", "0"]
        let r = parseInt(currCoords[0]);
        let c = parseInt(currCoords[1]);

        let otherCoords = otherTile.id.split("-");
        let r2 = parseInt(otherCoords[0]);
        let c2 = parseInt(otherCoords[1]);

        let moveLeft = r == r2 && c2 == c - 1;
        let moveRight = r == r2 && c2 == c + 1;

        let moveUp = c == c2 && r2 == r - 1;
        let moveDown = c == c2 && r2 == r + 1;

        let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

        if (isAdjacent) {
            let currImg = currTile.src;
            let otherImg = otherTile.src;

            currTile.src = otherImg;
            otherTile.src = currImg;

            turns += 1;
            document.getElementById("moves").innerText = turns;
        }
        checkWin();
}

function checkWin()
{
    if (document.getElementById("0-0").src.includes("cat-1.png")
    && document.getElementById("0-1").src.includes("cat-2.png")
    && document.getElementById("0-2").src.includes("cat-3.png")
    && document.getElementById("1-0").src.includes("cat-4.png")
    && document.getElementById("1-1").src.includes("cat-5.png")
    && document.getElementById("1-2").src.includes("cat-6.png")
    && document.getElementById("2-0").src.includes("cat-7.png")
    && document.getElementById("2-1").src.includes("cat-8.png")
    && document.getElementById("2-2").src.includes("cat-9.png"))
    {
        setTimeout(function () {
            document.getElementById("win-box").style.opacity = 1;
            document.getElementById("win-box").style.zIndex = 1;
        }, 1000);
    }
    
}

function resetGame()
{
    turns = 0;
    document.getElementById("moves").innerText = turns;
    randImgOrder = simpleShuffle(imgOrder);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let id = r.toString() + "-" + c.toString();
            document.getElementById(id).src = "slider_game/cat-" + randImgOrder.shift() + ".png";
        }
    }

    document.getElementById("win-box").style.opacity = 0;
    document.getElementById("win-box").style.zIndex = -1;
}
