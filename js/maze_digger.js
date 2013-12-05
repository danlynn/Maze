/**
 * For a nifty guides on making js objects with instance and class methods and 
 * attributes and inheritance, see: 
 *   + http://stackoverflow.com/questions/5030739/javascript-how-to-define-a-constructor
 *   + https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Details_of_the_Object_Model
 */
define(['lodash', 'bounded_moving_point'], function(_, BoundedMovingPoint) {

  /**
   * Constructs a new digger to start digging the specified 'maze'.  Note that 
   * if the initial x,y position is not an already 'dug' point in the maze then
   * the x,y position will be selected randomly by the pick_new_location() 
   * method.  If NO 'dug' points are found in the maze as a starting position
   * then the MazeDigger will simply stop execution without having performed
   * any digging.  After construction, call run() method to start digging.
   * 
   * @param x {number} initial position
   * @param y {number} initial position
   * @param vector {{x: (number), y: (number)}}
   * @param maze {Maze} maze instance in which to dig
   * @constructor
   */
  var MazeDigger = function(x, y, vector, maze) {
    BoundedMovingPoint.call(this, x, y, vector, {top: 2, right: maze.width, bottom: maze.height, left: 2});
    this.maze = maze;
  };

  MazeDigger.prototype = _.extend(new BoundedMovingPoint(), {
    
    directions: [
      {x: 0 , y:-2},
      {x: 2 , y: 0},
      {x: 0 , y: 2},
      {x:-2 , y: 0}
    ],
    
    /**
     * Determines if this MazeDigger instance can move in the direction 
     * specified by 'vector' from its current position.  The MazeDigger can move
     * as long as it does not dig into an already dug point in the 'maze' grid.
     * 
     * @returns {boolean} true if this MovingPoint can move
     */
    can_move: function() {
      try {
        if (this.maze.grid[this.x + this.vector.x][this.y + this.vector.y])
          return false;
      }
      catch(e) {
        return false; // probably array out of bounds
      }
      return BoundedMovingPoint.prototype.can_move.call(this);
    },

    /**
     * Pick a new location in a corridor of the maze that has at least 1 
     * available direction to dig.
     * 
     * @returns {boolean} true if new location found - else false if maze is done
     */
    pick_new_location: function() {
      var self = this;
      var new_location = this.maze.pick_new_location(function(x, y) {
        self.x = x;
        self.y = y;
        return self.pick_direction();
      });
      return new_location != null;
    },
    
    /**
     * Pick a random available direction.  This changes the 'vector' attribute.
     * 
     * @returns {boolean} - true if available direction found - else false
     */
    pick_direction: function() {
      var available = [];
      for (var dir = 0; dir < this.directions.length; ++dir) {
        this.vector = this.directions[dir];
        if (this.can_move())
          available.push(dir);
      }
      if (available.length == 0)
        return false;
      this.vector = this.directions[available[Math.floor((Math.random() * available.length))]];
      return true;
    },
  
    /**
     * Move the MazeDigger using 'vector'.  If it can't move to 'vector' 
     * position then pick a new direction (vector).  If there is no available
     * direction to move then pick a new location to start digging.  Randomly
     * changes direction & location.
     * 
     * @returns {boolean} true if moved - else false if maze completely dug
     */
    move: function() {
      if (Math.random() > 0.80 || !this.can_move())
        if (!this.pick_direction())
          if (!this.pick_new_location()) {
            console.debug('Maze completely dug!');
            clearInterval(this.run_interval);
            return false;
          }
      if (Math.random() > 0.95)
        this.pick_new_location();
      var context = this.maze.context;
//      context.moveTo(this.x * this.maze.scale, this.y * this.maze.scale);
      this.maze.grid[this.x + (this.vector.x / 2)][this.y + (this.vector.y / 2)] = true; // dig halfway point
      context.fillStyle = '#aaf';
      context.fillRect((this.x + (this.vector.x / 2)) * this.maze.scale - 5, (this.y + (this.vector.y / 2)) * this.maze.scale -5, 10, 10);
      this.x += this.vector.x;
      this.y += this.vector.y;
      this.maze.grid[this.x][this.y] = true; // dig destination point
      context.fillRect(this.x * this.maze.scale -5, this.y * this.maze.scale -5, 10, 10);
//      context.lineTo(this.x * this.maze.scale, this.y * this.maze.scale);
      return true;
    },
    
    /**
     * Run the MazeDigger on an interval until entire maze is dug.  Note this 
     * method returns immediately.
     * 
     * @param move_interval {number} ms to pause between each move
     */
    run: function(move_interval) {
      var context = this.maze.context;
//      context.strokeStyle = '#aaf';
      context.fillStyle = '#aaf';
//      context.lineWidth = 9;
//      context.lineCap = 'square';
      var self = this;
//      while (self.move());
      this.run_interval = window.setInterval(function() {
        for (var i = 0; i < 1 && self.move(); ++i);
//          context.stroke();
      }, move_interval);
    }
    
  });

  return MazeDigger;
  
});
