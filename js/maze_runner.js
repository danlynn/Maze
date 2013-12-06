/**
 * For a nifty guides on making js objects with instance and class methods and 
 * attributes and inheritance, see: 
 *   + http://stackoverflow.com/questions/5030739/javascript-how-to-define-a-constructor
 *   + https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Details_of_the_Object_Model
 */
define(['lodash', 'moving_point'], function(_, MovingPoint) {

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
  var MazeRunner = function(x, y, vector, maze) {
    this.maze = maze;
    this.vector = vector || this.directions[Math.floor((Math.random() * this.directions.length))];
    if (maze && (!x || !y))
      this.pick_new_location();
  };

  MazeRunner.prototype = _.extend(new MovingPoint(), {
    
    color: '#f00',
    
    directions: [
      {x: 0 , y:-1},
      {x: 1 , y: 0},
      {x: 0 , y: 1},
      {x:-1 , y: 0}
    ],
    
    /**
     * Determines if this MazeRunner instance can move in the direction 
     * specified by 'vector' from its current position.  The MazeRunner can move
     * as long as it does not dig into an already dug point in the 'maze' grid.
     * 
     * @returns {boolean} true if this MovingPoint can move
     */
    can_move: function() {
      try {
        if (this.maze.grid[this.x + this.vector.x][this.y + this.vector.y])
          return true;
      }
      catch(e) {
        return false; // probably array out of bounds (found exit)
      }
    },

    /**
     * Pick a new location in a corridor of the maze.
     * 
     * @returns {boolean} true if new location found - else false if no maze corridors
     */
    pick_new_location: function() {
      var self = this;
      var new_location = this.maze.pick_new_location(function(x, y) {
        self.x = x;
        self.y = y;
        return true;
      });
      return new_location != null;
    },
    
    /**
     * Pick a random available direction.  This changes the 'vector' attribute.
     * Note that reversing current direction is only performed if no other 
     * directions are available.
     * 
     * @returns {boolean} - true if available direction found - else false
     */
    pick_direction: function() {
      var reverse_vector = {x: -this.vector.x, y: -this.vector.y};
      var available = [];
      for (var dir = 0; dir < this.directions.length; ++dir) {
        this.vector = this.directions[dir];
        if (this.vector.x != reverse_vector.x || this.vector.y != reverse_vector.y)
          if (this.can_move())
            available.push(dir);
      }
      if (available.length == 0) {
        this.vector = reverse_vector;
        if (!this.can_move())
          return false; // closed off in a location with walls on 4 sides?
      }
      else
        this.vector = this.directions[available[Math.floor(Math.random() * available.length)]];
      return true;
    },

    /**
     * Determine if currently at intersection of maze.  An intersection is 
     * defined as any location that has more than 2 directions of travel.
     * 
     * @returns {boolean} true if at intersection
     */
    at_intersection: function() {
      var orig_vector = this.vector;
      var available = [];
      for (var dir = 0; dir < this.directions.length; ++dir) {
        this.vector = this.directions[dir];
        if (this.can_move())
          available.push(dir);
      }
      this.vector = orig_vector;
      return available.length > 2;
    },

    /**
     * Move the MazeRunner using 'vector'.  If it can't move to 'vector' then
     * pick a new direction.  If it comes to an intersection then pick a new
     * direction.
     * 
     * @returns {boolean}
     */
    move: function() {
      if (!this.can_move() || this.at_intersection())
        this.pick_direction();
      var context = this.maze.context;
      context.fillStyle = '#aaf';
      context.fillRect(this.x * this.maze.scale -3, this.y * this.maze.scale -3, 6, 6);
      this.x += this.vector.x;
      this.y += this.vector.y;
      context.fillStyle = this.color;
      context.fillRect(this.x * this.maze.scale -3, this.y * this.maze.scale -3, 6, 6);
      return true;
    },
    
    /**
     * Run the MazeRunner on an interval until entire maze is dug.  Note this 
     * method returns immediately.
     * 
     * @param move_interval {number} ms to pause between each move
     */
    run: function(move_interval) {
      var context = this.maze.context;
      var self = this;
//      while (self.move());
      this.run_interval = window.setInterval(function() {
        self.move();
        if (self.x == self.maze.exit.x && self.y == self.maze.exit.y) {
          clearInterval(self.run_interval);
          console.debug('--- MazeRunner stopped at exit');
        }
      }, 100);
    }
    
  });

  return MazeRunner;
  
});
