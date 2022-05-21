;(function (win, doc) {
    win.$ = function (el) {
        return /^#\S+/.test(el) ? doc.querySelector(el) : doc.querySelectorAll(el);
    }
    win.Game = function (id) {
        this.canvas = $(id);
        this.ctx = this.canvas.getContext('2d');
        this.mapWidth = this.canvas.width;
        this.mapHeight = this.canvas.height;
    }
    w = this.canvas.width;
    h = this.canvas.height;
    Game.prototype = {
    	fired : 0,
        score: 0, 
        spacing: 10, // space between blocks
        blocks: [], // object array list
        columns: 4, 
        rows: 4, 
        wined: false,
        overed: false,
        background_color: { // block background
            0: '#e0e0e0', 2: '#eee3da', 4: '#ede0c8', 8: '#f2b179',
            16: '#f59563', 32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72',
            256: '#edcc61', 512: '#9c0', 1024: '#33b5e5', 2048: '#09c',
            4096: '#a6c', 8192: '#93c'
        },
        // init_gameialization
        init_game: function () {
            this.score = 0;
            this.wined = false;
            this.overed = false;
            // caculating height and updata
            this.height = (this.mapHeight - (this.rows + 1) * this.spacing) / this.rows;
            // caculating weight and updata
            this.width = (this.mapWidth - (this.columns + 1) * this.spacing) / this.columns;
            // init
            for (var i = 0; i < this.rows; i++) {
                this.blocks[i] = [];
                for (var j = 0; j < this.columns; j++) {
                    var x = j * this.width + this.spacing * (j + 1);
                    var y = i * this.height + this.spacing * (i + 1);
                    this.blocks[i][j] = {
                        num: 0,
                        x: x,
                        y: y
                    };
                }
            }
            this.random();
            this.random();
            this.drawing();
            this.update_score();
        },
        // start_game the game
        start_game: function () {
            var self = this;
            self.init_game();
            doc.onkeydown = function (e) { // onclick event
                if (this.wined || this.overed) {
                    return false;
                }
                switch (e.keyCode) { // define orientation
                    case 37: // left
                        self.dir = 3;
                        self.left();
                        break;
                    case 38: // up
                        self.dir = 1;
                        self.up();
                        break;
                    case 39: // right
                        self.dir = 4;
                        self.right();
                        break;
                    case 40: // down
                        self.dir = 2;
                        self.down();
                        break;
                }
                self.update_score();
            };
        },
        // random number generating
        random: function () {
            while (1) {
                var row = Math.floor(Math.random() * this.rows);
                var col = Math.floor(Math.random() * this.columns);
                // only generating new block when the current one is empty
                if (this.blocks[row][col].num === 0) {
                    
                    this.blocks[row][col].num = (Math.random() >= 0.7) ? 4 : 2;
                    break;
                }
            }
        },
        // Update score
        update_score() {
            $('#score').innerText = this.score;
            var number = this.score;
            var fired = 0;
            if (number >= 40 && number < 100){
                $('#dog1').setAttribute('style', `display: none;`),
                $('#dog2').setAttribute('style', `display: block;`)
            }
            else if (number >= 100 && number < 300){
                $('#dog2').setAttribute('style', `display: none;`),
                $('#dog3').setAttribute('style', `display: block;`)
            }
            else if (number >= 300 && number < 500){
                $('#dog3').setAttribute('style', `display: none;`),
                $('#dog4').setAttribute('style', `display: block;`)
            }
            else if (number >= 500 && number < 1024){
                $('#dog4').setAttribute('style', `display: none;`),
                $('#dog5').setAttribute('style', `display: block;`)
            }
            else if (number >= 1024){
                $('#dog5').setAttribute('style', `display: none;`),
                $('#dog6').setAttribute('style', `display: block;`)
            }
        },
        // gameover
        game_overed: function () {
            for (var row = 0; row < this.rows; row++) {
                for (var col = 0; col < this.columns; col++) {
                    if (this.blocks[row][col].num === 0) {
                        return false;
                    } else if (col != this.columns - 1 && this.blocks[row][col].num === this.blocks[row][col + 1].num) {
                        return false;
                    } else if (row != this.rows - 1 && this.blocks[row][col].num === this.blocks[row + 1][col].num) {
                        return false;
                    }
                }
            }
            return true;
        },
        // search the next no 0 block
        search: function (row, col, start_game, condition) {
            if (this.dir === 1) { // up
                for (var f = start_game; f < condition; f += 1) {
                    if (this.blocks[f][col].num != 0) {
                        return f;
                    }
                }
            } else if (this.dir === 2) { // down
                for (var f = start_game; f >= condition; f += -1) {
                    if (this.blocks[f][col].num != 0) {
                        return f;
                    }
                }
            } else if (this.dir === 3) { // left
                for (var f = start_game; f < condition; f += 1) {
                    if (this.blocks[row][f].num != 0) {
                        return f;
                    }
                }
            } else if (this.dir === 4) { // right
                for (var f = start_game; f >= condition; f += -1) {
                    if (this.blocks[row][f].num != 0) {
                        return f;
                    }
                }
            }
            return null;
        },
        // move the block
        move: function (itertor) {
            var before,
                after; 
            before = this.To_string(this.blocks);
            itertor(); // iteration
            after = this.To_string(this.blocks);
            if (before != after) { 
                this.random();
                this.drawing();
                
            }
        },
        // left evenliseter
        left: function () {
            var self = this;
            this.move(function () {
                for (var row = 0; row < self.rows; row++) {
                    var next;
                    for (var col = 0; col < self.columns; col++) {
                        // search the first not 0 block
                        next = self.search(row, col, col + 1, self.columns); 
                        if (next == null) {
                            break; 
                        }
                        if (self.blocks[row][col].num === 0) {
                            // changing block
                            self.blocks[row][col].num = self.blocks[row][next].num; 
                            self.blocks[row][next].num = 0; 
                            col--; 
                            //Sum these two block
                        } else if (self.blocks[row][col].num === self.blocks[row][next].num) { 
                            self.blocks[row][col].num *= 2;
                            self.blocks[row][next].num = 0;
                            self.score += self.blocks[row][col].num;
                        }
                    }
                }
            });
        },
        // right
        right: function () {
            var self = this;
            this.move(function () {
                for (var row = 0; row < self.rows; row++) {
                    var next;
                    for (var col = self.columns - 1; col >= 0; col--) {
                        // search the first not 0 block
                        next = self.search(row, col, col - 1, 0); 
                        if (next == null) {
                            break; 
                        }
                        if (self.blocks[row][col].num === 0) {
                            // changing block
                            self.blocks[row][col].num = self.blocks[row][next].num;
                            self.blocks[row][next].num = 0; 
                            col++; 
                            //Sum these two block
                        } else if (self.blocks[row][col].num === self.blocks[row][next].num) { 
                            self.blocks[row][col].num *= 2;
                            self.blocks[row][next].num = 0;
                            self.score += self.blocks[row][col].num;
                        }
                    }
                }
            });
        },
        up: function () {
            var self = this;
            this.move(function () {
                for (var col = 0; col < self.columns; col++) {
                    var next;
                    for (var row = 0; row < self.rows; row++) {
                        // search the first not 0 block
                        next = self.search(row, col, row + 1, self.rows); 
                        if (next == null) {
                            break;
                        }
                        if (self.blocks[row][col].num === 0) {
                            // changing block
                            self.blocks[row][col].num = self.blocks[next][col].num; 
                            self.blocks[next][col].num = 0; 
                            row--; 
                            //Sum these two block
                        } else if (self.blocks[row][col].num == self.blocks[next][col].num) {
                            self.blocks[row][col].num *= 2;
                            self.blocks[next][col].num = 0;
                            self.score += self.blocks[row][col].num;
                        }
                    }
                }
            });
        },
        // text
        fillText(ctx, text, x, y, maxWidth, fillColor) {
            ctx.fillStyle = fillColor || "#000"; 
            ctx.font = "bold 60px 'Arial'"; 
            ctx.textAlign = 'center'; 
            ctx.textBaseline = "middle"; 
            ctx.fillText(text, x, y, maxWidth);
        },
         // rectangular
        fillRoundRect: function (ctx, x, y, width, height, radius, fillColor) {
            // radius must less than 2 times of height or width
            if (2 * radius > width || 2 * radius > height) {
                return false;
            }
            ctx.save();
            ctx.translate(x, y);
            // corner
            this.drawingRoundRectPath(ctx, width, height, radius);
            ctx.fillStyle = fillColor || "#000"; // color
            ctx.fill();
            ctx.restore();
        },
        // radius
        drawingRoundRectPath: function (ctx, width, height, radius) {
            ctx.beginPath(0);
            ctx.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
            ctx.lineTo(radius, height);
            ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
            ctx.lineTo(0, radius);
            ctx.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);
            ctx.lineTo(width - radius, 0);
            ctx.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);
            ctx.lineTo(width, height - radius);
            ctx.closePath();
        },
        // convert to string
        To_string: function (blocks) {
            var s = '[';
            for (var i in blocks) {
                if (Object.prototype.toString.call(blocks[i]) === '[object Array]') {
                    s += this.To_string(blocks[i]);
                } else if (Object.prototype.toString.call(blocks[i]) === '[object Object]') {
                    s += JSON.stringify(blocks[i]);
                } else {
                    s += blocks[i];
                }
            }
            s += ']';
            return s;
        },
        down: function () {
            var self = this;
            this.move(function () {
                for (var col = 0; col < self.columns; col++) {
                    var next;
                    for (var row = self.rows - 1; row >= 0; row--) {
                        // search the first not 0 block
                        next = self.search(row, col, row - 1, 0); 
                        if (next == null) {
                            break;
                        }
                        if (self.blocks[row][col].num === 0) {
                            // changing block
                            self.blocks[row][col].num = self.blocks[next][col].num; 
                            self.blocks[next][col].num = 0; 
                            row++; 
                            //Sum these two block
                        } else if (self.blocks[row][col].num === self.blocks[next][col].num) {
                            self.blocks[row][col].num *= 2;
                            self.blocks[next][col].num = 0;
                            self.score += self.blocks[row][col].num;
                        }
                    }
                }
            });
        },
        // drawing the block
        drawing: function () {
            // cleaning everything
            this.ctx.clearRect(0, 0, this.mapWidth, this.mapHeight);
            for (var row = 0; row < this.rows; row++) {
                for (var col = 0; col < this.columns; col++) {
                    //getting x
                    var x = this.blocks[row][col].x;
                    //getting y 
                    var y = this.blocks[row][col].y; 
                    // number
                    var num = this.blocks[row][col].num; 
                    //color
                    var color = this.background_color[num]; // 
                    // drawinging
                    this.fillRoundRect(this.ctx, x, y, this.width, this.height, 20, color);
                    
                    if (num > 0) { 
                        
                        this.fillText(this.ctx, num, x + this.width / 2, y + this.height / 2, this.width - 20, num <= 4 ? '#776e65' : '#fff');
                    	 
                    	
                    
                    }
                    if (this.rows === 4 && num === 2048) {
                        this.wined = true;
                    }
                }
            }
            if (this.wined) {
                $('#float_window').innerHTML = 'YOU WIN<br>SCORE:<br>' + this.score;
                $('#float_window').style.color = 'green';
                $('#float_window').style.cssText = "font-family: Arial";
                $('#game-over').style.display = 'block';
            }
            if (this.game_overed()) {
                this.overed = true;
                $('#float_window').innerHTML = 'GAME OVER<br>SCORE:<br>' + this.score;
                $('#float_window').style.cssText = "font-family: Arial";
                $('#float_window').style.color = 'red';
                $('#game-over').style.display = 'block';
            }
        },
    };
})(window, document);

var game = new Game('#canvas');
game.start_game();

// $('#mode').onchange = function () {
//     game.rows = game.columns = $('#mode').value / 1;
//     game.init_game();
//     $('#mode').blur();
// }

$('#again').onclick = function () {
    $('#game-over').style.display = 'none';
    location.reload();
    game.init_game();
}
