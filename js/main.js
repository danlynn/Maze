require.config({
  baseUrl: 'js',      // base url used in paths below '' => www dir

  paths: {
    'lodash': '../vendor/lodash.compat'
  }

});

require(['maze', 'maze_runner', 'right_maze_runner'], function(Maze, MazeRunner, RightMazeRunner) {
  console.debug('start');
  var maze = new Maze(160, 160); // 160, 230 -> 960, 1380
  var maze_digger = maze.dig();
  console.debug('--- done');
  document.getElementById('maze').onclick = function(event) {
    console.debug('--- adding MazeRunner');
    var maze_runner = null;
    console.debug('=== event.shiftKey:');
    console.debug(event.shiftKey);
    if (event.shiftKey)
      maze_runner = new RightMazeRunner(null, null, null, maze);
    else
      maze_runner = new MazeRunner(null, null, null, maze);
    maze_runner.run();
  };
});
