define(['lodash', 'maze_digger'], function(_, MazeDigger) {

  /**
   * Construct a new Maze with the specified 'width', 'height', and 'exit'
   * position.  The maze 'grid' is pre-allocated during construction.  The 
   * 'exit' point is 'dug' after grid allocation.
   * 
   * @param width
   * @param height
   * @param exit {{x: (number), y: (number)}}
   * @constructor
   */
  var Maze = function(width, height, exit) {
    this.width = width || 100;
    this.height = height || 100;
    this.exit = exit || {x: width - 2, y: Math.floor(height / 4) * 2};
    this.scale = 6; // maybe config this later
    this.canvas = document.getElementById('maze');
    this.context = this.canvas.getContext('2d');
    this.erase();
  };
  
  Maze.prototype = {

    directions: [
      {x: 0 , y:-2},
      {x: 2 , y: 0},
      {x: 0 , y: 2},
      {x:-2 , y: 0}
    ],
    
    /**
     * Allocated a new 'grid' (erasing any previous grid) and digs the 'exit'
     * point.
     */
    erase: function() {
      this.grid = new Array(this.width);
      for (var x = 0; x < this.width; ++x)
        this.grid[x] = new Array(this.height);
      this.grid[this.exit.x][this.exit.y] = true;
      // draw erased maze
      var context = this.context;
      context.fillRect(0, 0, this.width * this.scale, this.height * this.scale);
      context.fillStyle = '#aaf';
      context.fillRect(this.exit.x * this.scale - 5, this.exit.y * this.scale - 5, 20, 10);
    },

    /**
     * Pick a new location in this Maze instance.  The new position must
     * be on an existing corridor and have at least one available direction to
     * dig.  This method returns the x,y position that was found.  The 
     * basic algorithm is to pick a random event x,y position and if that 
     * position is not on an existing tunnel OR valid_location() callback 
     * returns false then the x,y position is moved in a pre-selected direction 
     * and this new position is then checked.  The pre-selected direction is 
     * either north or east.  When the position increments past the top or right 
     * of the maze then it continues at the bottom or left stepping one row or 
     * column over.  In this way, it will pick a random starting position to 
     * start looking and then scan sequentially to find a viable place to 
     * return.  If the sequential scan finally returns back to the original 
     * random starting position then the maze has UNSUCCESSFULLY been fully 
     * scanned for a new valid location and failed - thus, return null.  Upon 
     * finding the first valid location, the x,y location is returned.
     * 
     * @callback valid_location passed {x: (number), y: (number)} and returns
     *              true if location is valid - returning false will cause a new
     *              location to be selected and passed to 'valid_location' until
     *              it returns true
     * @returns {{x: (number), y: (number)}} true if new position found - else 
     *              false if no open positions left in the maze
     */
    pick_new_location: function(valid_location) {
      var x = Math.floor(Math.random() * this.width / 2) * 2;
      var y = Math.floor(Math.random() * this.height / 2) * 2;
      var orig_x = x;
      var orig_y = y;
      var vector = this.directions[Math.floor((Math.random() * 2))];  // either north or east
      while (!this.grid[x][y] || !valid_location(x, y)) {
        x += vector.x;
        y += vector.y;
        if (x >= this.width) {
          x -= this.width;
          y -= 2;
          if (y < 0)
            y += this.height;
        }
        else if (y < 0) {
          y += this.height;
          x += 2;
          if (x >= this.width)
            x -= this.width;
        }
        if (x == orig_x && y == orig_y)
          return null;
      }
      return {x: x, y: y};
    },

    /**
     * Generate the maze by ensuring a starting point (exit) is 'dug' and 
     * instantiating a MazeDigger on that point then invoking it.
     * 
     * @param width {number} must be even
     * @param height {number} must be even
     */
    dig: function() {
      var maze_digger = new MazeDigger(this.exit.x, this.exit.y, {x: -2.0, y: 0.0}, this);
      maze_digger.run(200);
      return maze_digger;
    }

  };
  
  return Maze;
  
});
