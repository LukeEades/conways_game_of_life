let next = document.getElementById("next");
let play = document.getElementById("play");
let reset = document.getElementById("reset");

let pop_count = document.getElementById("population");
let gen_count = document.getElementById("generation");

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
    if(population <= 0){
        paused = true;
        play.textContent = "play";
        return;
    }
    generation++;
    let temp = JSON.parse(JSON.stringify(grid));
    for(let i = 0; i < width; i++){
        for(let j = 0; j < height; j++){
            let num = get_num_neighbors(i, j);
            if(grid[i][j]){
                if(num < 2){
                    // dies
                    temp[i][j] = false;
                    population--;
                }else if(num > 3){
                    // dies
                    temp[i][j] = false;
                    population--;
                }
            }else{
                if(num == 3){
                    // becomes live
                    temp[i][j] = true;
                    population++;
                }
            }
        }
    }
    grid = [...temp];
    pop_count.textContent = `Population: ${population}`;
    gen_count.textContent = `Generation: ${generation}`;
}

function reset_grid(){
    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
            grid[j][i] = false;
        }
    }
    set_tex();
    draw_grid();
    population = 0;
    generation = 0;
    pop_count.textContent = `Population: ${population}`;
    gen_count.textContent = `Generation: ${generation}`;
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
        }
    } 
    tex.updatePixels();
}

function draw_grid(){
    texture(tex);
    quad(-WIDTH/2, -HEIGHT/2, WIDTH/2, -HEIGHT/2, WIDTH/2, HEIGHT/2, -WIDTH/2, HEIGHT/2);
}

let WIDTH = 700;
let HEIGHT = 700;
let cell_width = 5;

let width = 100;
let height = 100;
let options = {width: width, height:height};
let tex;
let interval = 1;
let paused = true;
let grid = [];


let translated_x = 0;
let translated_y = 0;
let translated_z = 0;
let population = 0;
let generation = 0;




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


function mouseClicked(){
    if(mouseButton == LEFT){
        let pos_x = Math.floor((mouseX - translated_x) * width / WIDTH);
        let pos_y = Math.floor((mouseY - translated_y) * height / HEIGHT);
        if(pos_x < width && pos_y < height && pos_x > 0 && pos_y > 0){
            population += grid[pos_x][pos_y]? -1: 1;
            grid[pos_x][pos_y] = !grid[pos_x][pos_y];

            set_tex();
            paused = true;
            play.textContent = "play";
            pop_count.textContent = `Population: ${population}`;
            draw_grid();
        }
        //console.log(pos_x, pos_y);
    }
}

function mousePressed(){


    return false;
}


function draw(){
    //if(keyIsDown(LEFT_ARROW) == true){
    //    translated_x += 10; 
    //}
    //if(keyIsDown(RIGHT_ARROW) == true){
    //    translated_x -= 10;
    //}
    //if(keyIsDown(UP_ARROW) == true){
    //    translated_y += 10; 
    //}
    //if(keyIsDown(DOWN_ARROW) == true){
    //    translated_y -= 10;
    //}


    //translate(translated_x, translated_y, translated_z);
    if(!paused){
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
    play.textContent = paused? "play": "pause";
});

reset.addEventListener("click", ()=>{
    reset_grid();
    paused = true;
    play.textContent = paused? "play": "pause";
});