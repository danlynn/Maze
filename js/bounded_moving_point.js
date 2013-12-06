define(['lodash', 'moving_point'], function(_, MovingPoint) {

  /**
   * Construct new instance of BoundedMovingPoint at specified position, vector,
   * and bounds.
   * 
   * @param x {number}
   * @param y {number}
   * @param vector {{x: (number), y: (number)}}
   * @param bounds {{top: (number), right: (number), bottom: (number), left: (number)}}
   * @constructor
   */
  var BoundedMovingPoint = function(x, y, vector, bounds) {
    MovingPoint.call(this, x, y, vector);
    this.bounds = bounds || {top: 0, right: 100, bottom: 100, left: 0};
  }

  BoundedMovingPoint.prototype = _.extend(new MovingPoint(), {
    
    /**
     * Determines if this MazeDigger instance can move in the direction 
     * specified by 'vector' from its current position.  Basically it can move
     * as long as 'vector' does not place it outside of the 'bounds'.
     * 
     * @returns {boolean} true if this MovingPoint can move
     */
    can_move: function() {
      var next_position = this.next_position();
      if (next_position.x >= this.bounds.right || 
          next_position.x < this.bounds.left ||
          next_position.y >= this.bounds.bottom ||
          next_position.y < this.bounds.top
      )
        return false;
      return MovingPoint.prototype.can_move.call(this);
    }

  });
  
  return BoundedMovingPoint;
  
});
