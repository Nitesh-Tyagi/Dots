const sz = 45;

const cells = document.getElementById('cells');
const grid = document.getElementById('grid');

let H,W;
let total;
let pinkScore = document.getElementById('pinkScore');
let blueScore = document.getElementById('blueScore');
const body = document.body;

let turn = 1;
const player = { name:'' };
const players = [ player, player ];

const winner = document.getElementById('winnerCard');

// DECODE FUNCTION
function decode(s) {
    const regex = /([A-Z])(\d+)_(\d+)/;
    const match = s.match(regex);

    if (match && match.length === 4) {
        const letter = match[1];
        const h = parseInt(match[2]);
        const w = parseInt(match[3]);

        return { h, w };
    }
    return null;
}
// ENCODE FUNCTION
function encode(c,h,w) {
    const s = c+String(h)+'_'+String(w);
    return s;
}

// FILL FUNCTION
function fill(el) {
    if(turn) el.classList.add('pink');
    else el.classList.add('blue');

    console.log(turn,' : ',el.id,' : ',el.classList);
}

// INCREASE SCORE
function scoreUp() {
    total--;
    // players[turn].score ++;
    // if(turn) pinkScore.innerText = players[turn].score;
    // else blueScore.innerText = players[turn].score;

    if(turn) pinkScore.innerText ++;
    else blueScore.innerText ++;

    // console.log('pink :',players[0].score);
    // console.log('blue :',players[1].score);

    
    // console.log('Total :',total);
}

// SUBMIT FORM FUNCTION
function submitForm(p,b) {
    players[0].name = p;
    player[0].class = 'pink';

    players[1].name = b;
    player[1].class = 'blue';
}

// CHECK CELL FUNCTION
function checkCell(h,w) {
    if(h<0 || h>H) return false;
    if(w<0 || w>W) return false;
    const cell = document.getElementById(encode('C',h,w));

    if( cell.classList.contains('pink') || cell.classList.contains('blue') ) return false;

    const u = document.getElementById(encode('H',h,w));
    const d = document.getElementById(encode('H',h+1,w));
    const l = document.getElementById(encode('V',h,w));
    const r = document.getElementById(encode('V',h,w+1));

    if(
        ( u.classList.contains('pink') || u.classList.contains('blue') ) &&
        ( d.classList.contains('pink') || d.classList.contains('blue') ) &&
        ( l.classList.contains('pink') || l.classList.contains('blue') ) &&
        ( r.classList.contains('pink') || r.classList.contains('blue') )       
    ) {
        return true;
    }
    else return false;
}

// CHECK WINNER FUNCTION
function checkWinner() {
    if(total==0){
        if(pinkScore.innerText > blueScore.innerText){
            winner.innerText = 'Pink Won!';
            winner.style.color = 'rgb(255,192,203,0.2)';
        }
        else if(pinkScore.innerText < blueScore.innerText){
            winner.innerText = 'Blue Won!';
            winner.style.color = 'rgb(181, 230, 253,0.2)';
        }
        else winner.innerText = 'Game Draw!';

        winner.style.opacity = 0.9;
        winner.style.zIndex = 10;
    }
}

// HANDLE CHECK FUNCTION
function handleClick() {
    if(this.classList.contains('pink') || this.classList.contains('blue')) return;

    const id = this.id;
    const decoded = decode(id);
    const h = decoded.h;
    const w = decoded.w;

    fill(this);

    let win = false;

    if(id[0]=='V'){
        if(checkCell(h,w-1)){
            const cell = document.getElementById(encode('C',h,w-1));
            fill(cell);
            scoreUp();
            win = 1;
        };
        if(h<H && w<W && checkCell(h,w)){
            const cell = document.getElementById(encode('C',h,w));
            fill(cell);
            scoreUp();
            win = 1;
        };
    } else if(id[0]=='H') {
        if(checkCell(h-1,w)){
            const cell = document.getElementById(encode('C',h-1,w));
            fill(cell);
            scoreUp();
            win = 1;
        };
        if(h<H && w<W && checkCell(h,w)){
            const cell = document.getElementById(encode('C',h,w));
            fill(cell);
            scoreUp();
            win = 1;
        };
    };

    // console.log('Turn ::',turn);
    if(!win){
        turn = 1-turn;
        
        console.log(body);
        if(turn) body.style.backgroundColor = 'rgb(255,192,203,0.2)';
        else body.style.backgroundColor = 'rgb(181, 230, 253,0.2)';
    }
    else checkWinner();
    console.log('Total :',total);
}

// ADD CELLS FUNCTION
function addCells(cells,h,w) {
    for(let i=0;i<h;i++){
        const row = document.createElement("div");
        row.classList.add('cellRow');

        for(let j=0;j<w;j++){
            const col = document.createElement("div");
            col.classList.add('cellCol');
            col.id = `C${i}_${j}`;
    
            row.appendChild(col);
        }

        cells.appendChild(row);
    }
}

// ADD DOTS,LINES FUNCTION
function addGrid(cells,h,w) {
    for(let i=0;i<=h;i++){
        // DH row
            const row = document.createElement("div");
            row.classList.add('lineRow');

            for(let j=0;j<w;j++){
                const d = document.createElement("div");
                d.classList.add('dot');
                d.id = `D${i}_${j}`;
                row.appendChild(d);

                const h = document.createElement("div");
                h.classList.add('lineHCol');
                // h.classList.add('pink');
                h.id = `H${i}_${j}`;
                h.addEventListener('click',handleClick);
                row.appendChild(h);
            }
            const d = document.createElement("div");
            d.classList.add('dot');
            d.id = `D${i}_${w}`;
            row.appendChild(d);
            cells.appendChild(row);
        
        // V row
        if(i<h){
            const row1 = document.createElement("div");
            row1.classList.add('lineRow');
            for(let j=0;j<=w;j++){
                const v = document.createElement("div");
                v.classList.add('lineVCol');
                // v.classList.add('blue');
                v.id = `V${i}_${j}`;
                v.addEventListener('click',handleClick);
                row1.appendChild(v);
            }
            cells.appendChild(row1);    
        }
    }

}

// CREATE FUNCTION
(function create(){
    body.style.backgroundColor = 'rgb(255,192,203,0.2)';
    let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

    const gH = Math.floor((vh * 0.8) / sz) * sz;
    const gW = Math.floor((vw * 0.8) / sz) * sz;

    H = gH/sz;
    W = gW/sz;
    total = H * W;

    addCells(cells,gH/sz,gW/sz);
    addGrid(grid,gH/sz,gW/sz);

    // console.log('reached here');
})();

