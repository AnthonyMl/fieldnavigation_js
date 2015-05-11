"use-strict"




var ctx;

var robotDisplayRadius = 0.3;
var gridSize = 20;
var startPosition = [-gridSize, -gridSize];
var model = new Model(11, startPosition, new Circle([gridSize, gridSize], [-3, 0], 1),
  [new Circle([-12, 13], [7, 0], 4), new Circle([-12, -8], [4, 0], 6), new Circle([2, 3.5], [-8, 0], 5), new Segment([-7, 4], [1, -11], 1.5)]);


function main()
{
  var resize = function()
  {
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.translate(window.innerWidth/2, window.innerHeight/2);
    ctx.scale(15, -15);
  }

  ctx = document.getElementById("canvas").getContext("2d");
  window.addEventListener("resize", resize, false);
  resize();
  window.requestAnimationFrame(frame);
}


var frame = (function()
{
  var lastTime = Date.now();
  return function()
  {
    var time = Date.now();
    update(time - lastTime);
    draw();
    lastTime = time;
    window.requestAnimationFrame(frame);
  };
})();


function update(inputDt)
{
  var dt = inputDt * 0.001;
  updateRobot(dt);
  updateGoal(dt);

  for(var obstacle of model.obstacles)
  {
    obstacle.update(dt);
  }
}


function updateRobot(dt)
{
  model.robotPosition =
    Vec2.length(Vec2.sub(model.robotPosition, model.goal.position)) < model.goal.radius ?
    startPosition :
    Vec2.add(model.robotPosition, Vec2.scale(dt * model.robotSpeed, forceDirection(model.robotPosition)));
}


function updateGoal(dt)
{
  newGoal = Vec2.add(model.goal.position, Vec2.scale(dt, model.goal.velocity));

  if(newGoal[0] < 0)
  {
    model.goal.position[0] = -newGoal[0];
    model.goal.velocity = Vec2.scale(-1, model.goal.velocity);
  }
  else if(newGoal[0] > gridSize)
  {
    model.goal.position[0] = 2 * gridSize - newGoal[0];
    model.goal.velocity = Vec2.scale(-1, model.goal.velocity);
  }
  else
  {
    model.goal.position[0] = newGoal[0];
  }
}


function forceDirection(position)
{
  var fG = Vec2.normalize(Vec2.sub(model.goal.position, position));
  var fO = [0, 0];

  for(var obstacle of model.obstacles) fO = Vec2.add(fO, obstacle.force(position));

  return Vec2.normalize(Vec2.add(fG, fO));
}


function draw()
{
  ctx.fillStyle = "rgb(64, 128, 255)";
  ctx.fillRect(-1.5*gridSize, -1.5*gridSize, 3*gridSize, 3*gridSize);

  ctx.fillStyle = ctx.strokeStyle = "rgb(170, 40, 40)";
  for(var obstacle of model.obstacles) obstacle.draw();

  drawGrid();

  ctx.beginPath();
  ctx.fillStyle = "rgb(200, 200, 40)";
  ctx.arc(model.robotPosition[0], model.robotPosition[1], robotDisplayRadius, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "rgb(40, 200, 40)";
  ctx.arc(model.goal.position[0], model.goal.position[1], model.goal.radius, 0, Math.PI*2);
  ctx.fill();
}


function drawGrid()
{
  ctx.strokeStyle = "rgb(200, 200, 200)";
  ctx.lineCap   = "blunt";
  ctx.lineWidth = 0.07;

  for(var x = -gridSize; x <= gridSize; x++)
  {
    for(var y = -gridSize; y <= gridSize; y++)
    {
      var end = Vec2.add([x, y], Vec2.scale(0.8, forceDirection([x, y])));

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(end[0], end[1]);
      ctx.stroke();
    }
  }
}
