let canvas;
let ctx;
let gBArrayHeight = 20;
let gBArrayWidth = 12;
let startX = 4;
let startY = 0;
let score = 0;
let niveaux = 1;
let gagnePerdre = "Joueur";
let coordonneeArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));
let curTetrisForme = [[1, 0], [0, 1], [1, 1], [2, 1]];
let tetrisForme = [];
let tetrisCouleur = ['purple', 'cyan', 'white', 'yellow', 'orange', 'green', 'red'];
let curTetrisFormCouleur;
let zoneJeuPiece = [...Array(20)].map(e => Array(12).fill(0));
let finFormePiece = [...Array(20)].map(e => Array(12).fill(0));
let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};
let direction;



document.addEventListener('DOMContentLoaded', SetupCanvas);

function SetupCanvas() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;

    ctx.scale(2, 2);

    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'black';
    ctx.strokeRect(8, 8, 280, 462);

    ctx.fillStyle = 'black';
    ctx.font = '21px Arial';
    ctx.fillText("SCORE", 300, 98);

    ctx.strokeRect(300, 107, 161, 24);

    ctx.fillText(score.toString(), 310, 127);

    ctx.fillText("NIVEAUX", 300, 157);

    ctx.strokeRect(300, 171, 161, 24);

    ctx.fillText(niveaux.toString(), 310, 190);

    ctx.fillText("GAGNER/PERDU", 300, 220);

    ctx.fillText(gagnePerdre, 310, 260);

    ctx.strokeRect(300, 230, 160, 90);

    ctx.fillText("CONTROLES", 300, 360);

    ctx.strokeRect(300, 360, 160, 120);

    ctx.font = '13px Arial';
    ctx.fillText("← : Movement gauche", 310, 388);
    ctx.fillText("→ : Movement droite", 310, 413);
    ctx.fillText("↓ : Movement bas", 310, 438);
    ctx.fillText("↑ : Rotation piece", 310, 463);

    document.addEventListener('keydown', TouchePresse);

    CreationTetrisForme();
    CreationTetrisForm();
    CreationCoordArray();
    dessinTetrisForme();
}


class Coordonnees {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function CreationCoordArray() {
    let xR = 0, yR = 15;
    let i = 0, j = 0;
    for (let y = 9; y <= 500; y += 23) {
        for (let x = 11; x <= 264; x += 23) {
            coordonneeArray[i][j] = new Coordonnees(x, y);
            i++;
        }
        j++;
        i = 0;
    }
}

function TouchePresse(key) {
    if (gagnePerdre != "Game Over") {
        // a keycode (LEFT)
        if (key.keyCode === 37) {
            direction = DIRECTION.LEFT;
            if (!murContact() && !CollisionHorizontal()) {
                SupprTetris();
                startX--;
                dessinTetrisForme();
            }
        } else if (key.keyCode === 39) {
            direction = DIRECTION.RIGHT;
            if (!murContact() && !CollisionHorizontal()) {
                SupprTetris();
                startX++;
                dessinTetrisForme();
            }
        } else if (key.keyCode === 40) {
            MoveBas();
        } else if (key.keyCode === 38) {
            rotationPiece();
        }
    }
}

function MoveBas() {
    direction = DIRECTION.DOWN;
    if (!collisionVertical()) {
        SupprTetris();
        startY++;
        dessinTetrisForme();
    }
}

window.setInterval(function () {
    if (gagnePerdre != "Game Over") {
        MoveBas();
    }
}, 1000);

function SupprTetris() {
    for (let i = 0; i < curTetrisForme.length; i++) {
        let x = curTetrisForme[i][0] + startX;
        let y = curTetrisForme[i][1] + startY;

        zoneJeuPiece[x][y] = 0;

        let coorX = coordonneeArray[x][y].x;
        let coorY = coordonneeArray[x][y].y;
        ctx.fillStyle = 'blue';
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

function dessinTetrisForme() {
    for (let i = 0; i < curTetrisForme.length; i++) {
        let x = curTetrisForme[i][0] + startX;
        let y = curTetrisForme[i][1] + startY;
        zoneJeuPiece[x][y] = 1;
        let coorX = coordonneeArray[x][y].x;
        let coorY = coordonneeArray[x][y].y;
        ctx.fillStyle = curTetrisFormCouleur;
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

function CreationTetrisForme() {
    tetrisForme.push([[1, 0], [0, 1], [1, 1], [2, 1]]);
    tetrisForme.push([[0, 0], [1, 0], [2, 0], [3, 0]]);
    tetrisForme.push([[0, 0], [0, 1], [1, 1], [2, 1]]);
    tetrisForme.push([[0, 0], [1, 0], [0, 1], [1, 1]]);
    tetrisForme.push([[2, 0], [0, 1], [1, 1], [2, 1]]);
    tetrisForme.push([[1, 0], [2, 0], [0, 1], [1, 1]]);
    tetrisForme.push([[0, 0], [1, 0], [1, 1], [2, 1]]);
}

function CreationTetrisForm() {
    let pieceRandom = Math.floor(Math.random() * tetrisForme.length);
    curTetrisForme = tetrisForme[pieceRandom];
    curTetrisFormCouleur = tetrisCouleur[pieceRandom];
}

function murContact() {
    for (let i = 0; i < curTetrisForme.length; i++) {
        let newX = curTetrisForme[i][0] + startX;
        if (newX <= 0 && direction === DIRECTION.LEFT) {
            return true;
        } else if (newX >= 11 && direction === DIRECTION.RIGHT) {
            return true;
        }
    }
    return false;
}

function collisionVertical() {

    let tetrisCopy = curTetrisForme;
    let collision = false;
    for (let i = 0; i < tetrisCopy.length; i++) {
        let square = tetrisCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        if (direction === DIRECTION.DOWN) {
            y++;
        }
        if (typeof finFormePiece[x][y + 1] === 'string') {
            SupprTetris();
            startY++;
            dessinTetrisForme();
            collision = true;
            break;
        }
        if (y >= 20) {
            collision = true;
            break;
        }
    }
    if (collision) {
        if (startY <= 2) {
            gagnePerdre = "Game Over";
            ctx.fillStyle = 'blue';
            ctx.fillRect(310, 242, 140, 30);
            ctx.fillStyle = 'black';
            ctx.fillText(gagnePerdre, 310, 261);
        } else {
            for (let i = 0; i < tetrisCopy.length; i++) {
                let square = tetrisCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;
                finFormePiece[x][y] = curTetrisFormCouleur;
            }
            ligneComplet();
            CreationTetrisForm();
            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            dessinTetrisForme();
        }

    }
}



function CollisionHorizontal() {
    var tetrisCopie = curTetrisForme;
    var collision = false;
    for (var i = 0; i < tetrisCopie.length; i++) {
        var square = tetrisCopie[i];
        var x = square[0] + startX;
        var y = square[1] + startY;
        if (direction == DIRECTION.LEFT) {
            x--;
        } else if (direction == DIRECTION.RIGHT) {
            x++;
        }
        var stoppedShapeVal = finFormePiece[x][y];
        if (typeof stoppedShapeVal === 'string') {
            collision = true;
            break;
        }
    }
    return collision;
}
function ligneComplet() {
    let ligneSuppr = 0;
    let suppression = 0;
    for (let y = 0; y < gBArrayHeight; y++) {
        let complete = true;
        for (let x = 0; x < gBArrayWidth; x++) {
            let square = finFormePiece[x][y];
            if (square === 0 || (typeof square === 'indefinis')) {
                complete = false;
                break;
            }
        }

        if (complete) {
            if (suppression === 0) suppression = y;
            ligneSuppr++;
            for (let i = 0; i < gBArrayWidth; i++) {
                finFormePiece[i][y] = 0;
                zoneJeuPiece[i][y] = 0;
                let coorX = coordonneeArray[i][y].x;
                let coorY = coordonneeArray[i][y].y;
                ctx.fillStyle = 'blue';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
    if (ligneSuppr > 0) {
        score += 10;
        ctx.fillStyle = 'blue';
        ctx.fillRect(310, 109, 140, 19);
        ctx.fillStyle = 'black';
        ctx.fillText(score.toString(), 310, 127);
        MoveAllRowsDown(ligneSuppr, suppression);
    }
}

function MoveAllRowsDown(rowsToDelete, startOfDeletion) {
    for (var i = startOfDeletion - 1; i >= 0; i--) {
        for (var x = 0; x < gBArrayWidth; x++) {
            var y2 = i + rowsToDelete;
            var square = finFormePiece[x][i];
            var nextSquare = finFormePiece[x][y2];

            if (typeof square === 'string') {
                nextSquare = square;
                zoneJeuPiece[x][y2] = 1;
                finFormePiece[x][y2] = square;
                let coorX = coordonneeArray[x][y2].x;
                let coorY = coordonneeArray[x][y2].y;
                ctx.fillStyle = nextSquare;
                ctx.fillRect(coorX, coorY, 21, 21);
                square = 0;
                zoneJeuPiece[x][i] = 0;
                finFormePiece[x][i] = 0;
                coorX = coordonneeArray[x][i].x;
                coorY = coordonneeArray[x][i].y;
                ctx.fillStyle = 'blue';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
}

function rotationPiece() {
    let newRotation = new Array();
    let tetrisCopie = curTetrisForme;
    let curTettris;

    for (let i = 0; i < tetrisCopie.length; i++) {
        curTettris = [...curTetrisForme];

        let x = tetrisCopie[i][0];
        let y = tetrisCopie[i][1];
        let newX = (dernierePiece() - y);
        let newY = x;
        newRotation.push([newX, newY]);
    }
    SupprTetris();

    try {
        curTetrisForme = newRotation;
        dessinTetrisForme();
    } catch (e) {
        if (e instanceof TypeError) {
            curTetrisForme = curTettris;
            SupprTetris();
            dessinTetrisForme();
        }
    }
}

function dernierePiece() {
    let pieceX = 0;
    for (let i = 0; i < curTetrisForme.length; i++) {
        let piece = curTetrisForme[i];
        if (piece[0] > pieceX)
            pieceX = piece[0];
    }
    return pieceX;

}