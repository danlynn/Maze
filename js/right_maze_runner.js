/**
 * For a nifty guides on making js objects with instance and class methods and 
 * attributes and inheritance, see: 
 *   + http://stackoverflow.com/questions/5030739/javascript-how-to-define-a-constructor
 *   + https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Details_of_the_Object_Model
 */
define(['lodash', 'moving_point', 'maze_runner'], function(_, MovingPoint, MazeRunner) {

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
  var RightMazeRunner = function(x, y, vector, maze) {
    MazeRunner.call(this, x, y, vector, maze);
  };

  RightMazeRunner.prototype = _.extend(new MazeRunner(), {
    
    color: '#ff0',
    
    /**
     * Pick a right turn if available - else go straight - else left - else 
     * behind.  This changes the 'vector' attribute.  You can think of this
     * algorithm as dragging your hand along the wall to your right and never
     * letting it lift off as you follow the wall on the right.
     * 
     * Computationally, at any intersection or point where it can no longer 
     * travel forward, this algorithm picks dir north then keeps rotating to the 
     * right until it finds a dir that matches the original vector.  It then 
     * turns once more to the right.  After that if checks if it can move in 
     * that direction.  If it can't then it successively turns to the left until 
     * it can_move().
     * 
     * @returns {boolean} - true if available direction found - else false
     */
    pick_direction: function() {
      var orig_vector = {x: this.vector.x, y: this.vector.y};
      var dir = this.directions.length;
      this.vector = this.directions[dir % this.directions.length];
      var next_is_right = false;
      while (!next_is_right) {
        if (this.vector.x == orig_vector.x && this.vector.y == orig_vector.y)
          next_is_right = true;
        this.vector = this.directions[++dir % this.directions.length];
      }
      while (dir >= 0 && !this.can_move())
        this.vector = this.directions[--dir % this.directions.length];
      return true;
    }

  });

  return RightMazeRunner;
  
});
