define([], function() {

  /**
   * Construct new instance of MovingPoint at specified position and vector
   * 
   * @param x {number}
   * @param y {number}
   * @param vector {{x: (number), y: (number)}}
   * @constructor
   */
  var MovingPoint = function(x, y, vector) {
    this.x = x || 0;
    this.y = y || 0;
    this.vector = vector || {x: 0, y:0};
  };

  MovingPoint.prototype = {
    
    /**
     * Determines if this MovingPoint instance can move in the direction 
     * specified by 'vector' from its current position.
     * 
     * @returns {boolean} true if this MovingPoint can move
     */
    can_move: function() {
      return true;
    },

    /**
     * Get the position that MovingPoint will be at upon the next move.
     * 
     * @returns {{x: (number), y: (number)}}
     */
    next_position: function() {
      return {
        x: this.x + this.vector.x,
        y: this.y + this.vector.y
      };
    },

    /**
     * Move this MovingPoint instance 'dir' * 'speed' - but only if can_move()
     * returns true.
     */
    move: function() {
      if (can_move()) {
        this.x += this.vector.x;
        this.y += this.vector.y;
      }
    }
  };

  return MovingPoint;
  
});
