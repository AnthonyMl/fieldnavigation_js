"use strict"

var Vec2 = {
  add : function(a, b)
  {
    return [a[0] + b[0], a[1] + b[1]];
  },
  sub : function(a, b)
  {
    return [a[0] - b[0], a[1] - b[1]];
  },
  dot : function(a, b)
  {
    return a[0] * b[0] + a[1] * b[1];
  },
  scale : function(t, v)
  {
    return [t * v[0], t * v[1]];
  },
  length : function(v)
  {
    return Math.sqrt(Vec2.dot(v, v));
  },
  normalize : function(v)
  {
    var length = Vec2.length(v);
    return [v[0] / length, v[1] / length];
  }
};
