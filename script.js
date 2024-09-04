let next = document.getElementById("next");
let play = document.getElementById("play");
let reset = document.getElementById("reset");

function set_color(ctx, color){
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
}


// returns the number of neighbors of a cell that are alive
function get_num_neighbors(x, y){
    let count = 0;
    let stuff = [];
    if(x - 1 > 0){
        if(y - 1 > 0){
            count += grid[x - 1][y - 1]? 1: 0;
            stuff.push({x: x - 1, y: y - 1, stat: grid[x - 1][y - 1]});
        }
        count += grid[x - 1][y]? 1: 0;
        stuff.push({x: x - 1, y: y, stat: grid[x - 1][y]});
        if(y + 1 < height){
            count += grid[x - 1][y + 1]? 1: 0;
            stuff.push({x: x - 1, y: y + 1, stat: grid[x - 1][y + 1]});
        }
    }
    if(x + 1 < width){
        if(y - 1 > 0){
            count += grid[x + 1][y - 1]? 1: 0;
            stuff.push({x: x + 1, y: y - 1, stat: grid[x + 1][y - 1]});
        }
        count += grid[x + 1][y]? 1: 0;
        stuff.push({x: x + 1, y: y, stat: grid[x + 1][y]});
        if(y + 1 < height){
            count += grid[x + 1][y + 1]? 1: 0;
            stuff.push({x: x + 1, y: y + 1, stat: grid[x + 1][y + 1]});
        }
    }
    if(y - 1 > 0){
        count += grid[x][y - 1]? 1: 0;
        stuff.push({x: x, y: y - 1, stat: grid[x][y - 1]});
    }
    if(y + 1 < height){
        count += grid[x][y + 1]? 1: 0;
        stuff.push({x: x, y: y + 1, stat: grid[x][y + 1]});
    }
    return count;
}


function set_cell(x, y, status){
    grid[x][y] = status;
}

function new_gen(){
    let temp = JSON.parse(JSON.stringify(grid));
    for(let i = 0; i < width; i++){
        for(let j = 0; j < height; j++){
            let num = get_num_neighbors(i, j);
            if(grid[i][j]){
                if(num < 2){
                    // dies
                    temp[i][j] = false;
                }else if(num > 3){
                    // dies
                    temp[i][j] = false;
                }
            }else{
                if(num == 3){
                    // becomes live
                    temp[i][j] = true;
                }
            }
        }
    }
    grid = [...temp];

}

function reset_grid(){
    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
            grid[j][i] = false;
        }
    }
    set_cell(10, 10, true);
    set_cell(10, 11, true);
    set_cell(10, 12, true);
    set_cell(11, 12, true);
    set_cell(9, 11, true);
    background(0);
    set_tex();
    draw_grid();
}

function set_tex(){
    tex.loadPixels();
    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
            let coord = 4 * (i * height + j);
            if(grid[j][i]){
                tex.pixels[coord] = 255;
                tex.pixels[coord + 1] = 255;
                tex.pixels[coord + 2] = 255;
                tex.pixels[coord + 3] = 255;
            }else{
                tex.pixels[coord] = 0;
                tex.pixels[coord + 1] = 0;
                tex.pixels[coord + 2] = 0;
                tex.pixels[coord + 3] = 255;
            }
            //if(j % 2 == 0){
            //    tex.pixels[coord] = 255;
            //    tex.pixels[coord + 1] = 0;
            //    tex.pixels[coord + 2] = 255;
            //    tex.pixels[coord + 3] = 255;
            //}
        }
    } 
    tex.updatePixels();
}

function mouseWheel(event){
    if(event.delta > 0){
        translate(0, 0, 1);
    }else{
        translate(0, 0, -1); 
    }
}


function draw_grid(){
    //fill(0, 0, 255);
    texture(tex);
    quad(-WIDTH/2, -HEIGHT/2, WIDTH/2, -HEIGHT/2, WIDTH/2, HEIGHT/2, -WIDTH/2, HEIGHT/2);
}

let WIDTH = 500;
let HEIGHT = 500;
let cell_width = 5;

let width = 100;
let height = 100;
let options = {width: width, height:height};
let tex;
let interval = 1;
let paused = true;
let grid = [];


let zoom = 0;



let canvas_tex;
function setup(){
    for(let i = 0; i < width; i++){
        grid[i] = [];
        for(let j = 0; j < height; j++){
            grid[i][j] = false;
        }
    }
    let canvas = createCanvas(WIDTH, HEIGHT, WEBGL);
    textureMode(IMAGE);
    textureWrap(COVER);
    noStroke();
    canvas.parent("canvas");
    tex = createFramebuffer(options);
    tex.loadPixels();
    tex.pixelDensity(1);
    canvas_tex = canvas.getTexture(tex);
    canvas_tex.setInterpolation(NEAREST, NEAREST);
    reset_grid();
}



function draw(){
    if(!paused){
    background(0);
        new_gen();
        set_tex();
        draw_grid();
    }
}



next.addEventListener("click", ()=>{
    if(paused){
        background(0);
        new_gen();
        set_tex();
        draw_grid();
    }
});

play.addEventListener("click", ()=>{
    paused = !paused;
})

reset.addEventListener("click", ()=>{
    reset_grid();
    paused = true;
})