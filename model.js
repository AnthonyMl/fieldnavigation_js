"use strict"

function Model(robotPosition, goal, obstacles)
{
  this.robotPosition = robotPosition;
  this.goal          = goal;
  this.obstacles     = obstacles;
}


function Circle(position, velocity, radius)
{
  this.position = position;
  this.velocity = velocity;
  this.radius   = radius;
}

Circle.prototype.update = function(dt)
{
  var newPosition = Vec2.add(this.position, Vec2.scale(dt, this.velocity));

  if(newPosition[0] < -gridSize)
  {
    this.position[0] = -2 * gridSize - newPosition[0];
    this.velocity = Vec2.scale(-1, this.velocity);
  }
  else if(newPosition[0] > gridSize)
  {
    this.position[0] = 2 * gridSize - newPosition[0];
    this.velocity = Vec2.scale(-1, this.velocity);
  }
  else
  {
    this.position[0] = newPosition[0];
  }
}

Circle.prototype.draw = function()
{
  ctx.beginPath();
  ctx.arc(this.position[0], this.position[1], this.radius, 0, Math.PI*2);
  ctx.fill();
}

Circle.prototype.force = function(position)
{
  var difference = Vec2.sub(position, this.position);
  var length     = Vec2.length(difference);

  return Vec2.scale((this.radius*this.radius)/(length*length*length), difference);
}


function Segment(a, b, width)
{
  this.a     = a;
  this.b     = b;
  this.width = width;
}

Segment.prototype.update = function(dt){ return this; }

Segment.prototype.draw = function()
{
  ctx.lineWidth = 2*(this.width - robotDisplayRadius);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(this.a[0], this.a[1]);
  ctx.lineTo(this.b[0], this.b[1]);
  ctx.stroke();
}

Segment.prototype.force = function(position)
{
  var ab = Vec2.sub(this.b  , this.a);
  var ap = Vec2.sub(position, this.a);
  var bp = Vec2.sub(position, this.b);

  if(Vec2.dot(ab, ap) < 0)
  {
    var apDist = Vec2.length(ap);
    return Vec2.scale(this.width*this.width / (apDist*apDist*apDist), ap);
  }
  else if(Vec2.dot(ab, bp) > 0)
  {
    var bpDist = Vec2.length(bp);
    return Vec2.scale(this.width*this.width / (bpDist*bpDist*bpDist), bp);
  }
  else
  {
    var perp = Vec2.normalize([-ab[1], ab[0]]);
    var perpDist = Vec2.dot(perp, ap);
    return Vec2.scale(((perpDist > 0 ? 1 : -1) * this.width * this.width) / (perpDist*perpDist), perp);
  }
}
