import * as Matter from 'matter-js'
import './styles.css';

export const handler = ({
  inputs,
  mechanic,
  sketch
}) => {
  const {
    width,
    height,
    tagline,
    color1,
    color2,
    backgroundColor1,
    backgroundColor2,
    seconds,
    shapes,
    sizes,
    numOfShapes,
    mode,
    backgroundRotation,
    textShow
  } =
  inputs;

  // module aliases
  const Engine = Matter.Engine,
    World = Matter.World,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Bodies = Matter.Bodies;

  let engine;
  let world;
  let canvas;
  let ctx;
  let boxes = [];
  let circles = [];
  let grounds = [];
  let font

  const raw = tagline.split(" ");
  let holder = []
  const maxText = parseInt(mapRange(height / width, 1.3, 0.5, 12, 20))

  for (var i = 0, j = raw.length - 1; i <= j; i++) { // Iterate all but last (last can never be glued to non-existing next)
    let curr = raw[i]; // This piece
    let next = raw[i + 1]
    if (next) {
      if (curr.length + next.length < maxText) { // If its length is smaller than 3
        curr += ' ' + raw[++i]; // ... glue with next and skip next (increment i)
      }
    }
    holder.push(curr.toUpperCase()); // Add to output
  }
  const lines = [...holder]
  const maxLength = Math.max(...(lines.map(el => el.length)));
  const maxLine = Math.floor((height / (90) * width / 850))
  const fontSize = (150 - Math.max(0, (lines.length - maxLine)) * 7 - Math.max(0, maxLength) * 5) * width / 850

  const bgHeight = Math.random() * height
  const rotateBg = Math.random() * 40

  const sizer = Math.min(width, height)
  const smallSizes = [sizer / 10, sizer / 9, sizer / 8, sizer / 7];
  const mediumSizes = [sizer / 7, sizer / 6, sizer / 5];
  const bigSizes = [sizer / 4, sizer / 3, sizer / 3, sizer / 2];
  const mixSizes = [sizer / 10, sizer / 8, sizer / 7, sizer / 6, sizer / 5, sizer / 2];

  const borderThickness = 10;
  const firstLine = height / 2 - Math.floor(lines.length / 2) * fontSize;

  sketch.setup = () => {
    // 	create a p5 canvas & default settings
    canvas = sketch.createCanvas(width, height);
    engine = Engine.create();

    if (mode == 'fly') {
      engine.world.gravity.y = -0.1;
    } else {
      engine.world.gravity.y = 0.6;
    }

    world = engine.world;
    ctx = canvas.drawingContext;

    // walls
    grounds.push(new Boundary(0, height / 2, borderThickness, height));
    grounds.push(new Boundary(width, height / 2, borderThickness, height));

    if (mode == 'gravity' || mode == 'spawn') {
      grounds.push(new Boundary(width / 2, height, width, borderThickness));
    }
    World.add(world, grounds);
    Matter.Resolver._restingThresh = 0.1;

    // 	mouse interactions
    let mouse = Mouse.create(canvas.elt);
    mouse.pixelRatio = sketch.pixelDensity(); // for retina displays etc
    let options = {
      mouse: mouse,
      constraint: {
        stiffness: 0.1,
      }
    };
    let mConstraint = MouseConstraint.create(engine, options);
    World.add(world, mConstraint);
    sketch.noStroke()
  };

  sketch.draw = () => {
    sketch.background(backgroundColor1);
    sketch.fill(backgroundColor2);
    sketch.push()
    sketch.translate(0, bgHeight)
    if (backgroundRotation) {
      sketch.rotate(rotateBg)
    }
    sketch.rect(0, 0, width, height * 30)
    sketch.pop()

    if (textShow) {
      // small text
      sketch.fill(color1)
      sketch.textFont('Object Sans')
      sketch.textSize(sizer / 30)
      sketch.textAlign(sketch.CENTER)
      sketch.text('mechanic.design', width / 2, Math.min(height / 4, firstLine - fontSize * 2))

      // tagline
      sketch.fill(color1)
      sketch.textFont('Object Sans Heavy')
      sketch.textSize(fontSize)
      sketch.textAlign(sketch.CENTER)
      lines.map((el, i) => sketch.text(el, width / 2, firstLine + i * fontSize));
    }


    if (boxes.length + circles.length < numOfShapes) {

      switch (mode) {
        case 'gravity':
          drawShapes(sketch.random(width), -height / 4, 20);
          break;
        case 'spawn':
          drawShapes(sketch.random(width), height / 2, 10);
          break;
        case 'fly':
          drawShapes(sketch.random(width), height * 1.5, 10);
          break;
        case 'bottomless':
          drawShapes(sketch.random(width), -height, 10);
          break;
      }
    } else {
      Engine.update(engine);
      for (let box of boxes) {
        box.show();
      }
      for (let circle of circles) {
        circle.show();
      }
    }

    if (sketch.millis() / 1000 < seconds) {
      mechanic.frame();
    } else {
      mechanic.done();
    }
  };

  function drawShapes(x, y, timer = 20) {
    if (sketch.frameCount % timer === 0) {
      let size = sizeArray(sizes)
      let offX = sketch.random(-width / 6, width / 6);
      let offY = sketch.random(height / 4);

      switch (shapes) {
        case 'mechanic':
          boxes.push(new Box(x + offX, y + offY, size, size / 2.5));
          break;
        case 'circles':
          circles.push(new Circle(x + offX, y + offY, size / 2));
          break;
        case 'both':
          boxes.push(new Box(x + offX, y + offY, size, size / 2.5));
          circles.push(new Circle(x + offX, y + offY, size / 2));
          break;
      }
    }
    Engine.update(engine);
    for (let box of boxes) {
      box.show();
    }
    for (let circle of circles) {
      circle.show();
    }
  }

  function sizeArray(name) {
    switch (name) {
      case 'smallSizes':
        return sketch.random(smallSizes);
        break;
      case 'mediumSizes':
        return sketch.random(mediumSizes);
        break;
      case 'bigSizes':
        return sketch.max(sketch.random(bigSizes), sketch.random(bigSizes));
        break;
      case 'mixSizes':
        return sketch.random(mixSizes);
        break;
    }
  }

  function mapRange(value, a, b, c, d) {
    // first map value from (a..b) to (0..1)
    value = (value - a) / (b - a);
    // then map it from (0..1) to (c..d) and return it
    let output = Math.max(Math.min(c + value * (d - c), d), c)
    return output;
  }

  class Circle {
    constructor(x, y, r) {
      let options = {
        friction: 0.0001,
        restitution: 0.4,
        angle: -1.5 + Math.random() * 3,
        density: 1,
      };
      this.body = Bodies.circle(x, y, r, options);
      this.r = r;
      this.angle = Math.random() * 360;
      World.add(world, this.body);
    }
    show() {
      let pos = this.body.position;
      let angle = this.body.angle

      sketch.push();
      sketch.noStroke();
      sketch.translate(pos.x, pos.y);
      sketch.rotate(angle);
      sketch.fill(color1);
      sketch.ellipse(0, 0, this.r * 1.9);
      sketch.fill(color2);
      sketch.arc(0, 0, this.r * 1.9, this.r * 1.9, 0, sketch.PI);
      sketch.pop();
    }
  }

  class Box {
    constructor(x, y, w, h) {
      var options = {
        friction: 0.0001,
        restitution: 0.4,
        angle: -1.5 + Math.random() * 3,
        density: 1,
      };
      this.body = Bodies.rectangle(x, y, w, h, options);
      this.w = w;
      this.h = h;
      World.add(world, this.body);
    }

    show() {
      let pos = this.body.position;
      let angle = this.body.angle;

      sketch.push();
      sketch.translate(pos.x, pos.y);
      sketch.rotate(angle);
      sketch.rectMode(sketch.CENTER);
      sketch.noStroke()

      sketch.push()
      sketch.fill(color1);
      sketch.rect(0, 0, this.w, this.h, this.w);
      sketch.pop()

      sketch.fill(color2);
      sketch.push()
      sketch.translate(-this.w / 2 + this.h / 2, 0);
      sketch.arc(0, 0, this.h, this.h, sketch.PI, sketch.PI * 1.5);
      sketch.pop()
      sketch.push()
      sketch.rectMode(sketch.CORNER)
      sketch.translate(-this.w / 2 + this.h / 2 - 0.5, -this.h / 2)
      sketch.rect(0, 0, this.w - this.h + 1, this.h / 2, 0);
      sketch.pop()
      sketch.push()
      sketch.translate(this.w / 2 - this.h / 2, 0);
      sketch.arc(0, 0, this.h, this.h, 1.5 * sketch.PI, 0);
      sketch.pop()

      sketch.textFont('Futura')
      sketch.textLeading(this.h / 3);
      sketch.textSize(this.h / 3)

      sketch.fill(color1);
      sketch.textAlign(sketch.CENTER);
      sketch.text('MECHANIC', 0, -5)

      sketch.fill(color2);
      sketch.textAlign(sketch.CENTER);
      sketch.text('\nDESIGN', 0, 0)

      sketch.pop();
    }
  }

  class Boundary {
    constructor(x, y, w, h) {
      let options = {
        friction: 0.3,
        restitution: 0.6,
        isStatic: true,
      };
      this.body = Bodies.rectangle(x, y, w, h, options);
      this.w = w;
      this.h = h;
      World.add(world, this.body);
    }

    show() {
      let pos = this.body.position;
      let angle = this.body.angle;

      sketch.push();
      sketch.translate(pos.x, pos.y);
      sketch.rotate(angle);
      sketch.rectMode(sketch.CENTER);
      sketch.strokeWeight(1);
      sketch.noStroke();
      sketch.fill(borderColor);
      sketch.rect(0, 0, this.w, this.h);
      sketch.pop();
    }
  }
};

export const inputs = {
  width: {
    type: "number",
    default: 812,
  },
  height: {
    type: "number",
    default: 1148,
  },
  seconds: {
    type: "number",
    default: 15,
  },
  tagline: {
    type: "text",
    default: "Mechanic 2.0V is dropping",
  },
  shapes: {
    type: "text",
    default: 'both',
    options: ['mechanic', 'circles', 'both']
  },
  sizes: {
    type: "text",
    default: 'mixSizes',
    options: ['smallSizes', 'mediumSizes', 'bigSizes', 'mixSizes']
  },
  mode: {
    type: "text",
    default: 'gravity',
    options: ['gravity', 'spawn', 'fly', 'bottomless']
  },
  numOfShapes: {
    type: "number",
    default: 9,
    min: 0,
    max: 60,
    step: 3,
    slider: true,
  },
  backgroundColor1: {
    type: "color",
    model: "hex",
    default: "#002EBB",
  },
  backgroundColor2: {
    type: "color",
    model: "hex",
    default: "#E94225",
  },
  color1: {
    type: "color",
    model: "hex",
    default: "#ffffff",
  },
  color2: {
    type: "color",
    model: "hex",
    default: "#002EBB",
  },
  backgroundRotation: {
    type: "boolean",
    default: false,
  },
  textShow: {
    type: "boolean",
    default: true,
  }
};

export const presets = {
  medium: {
    width: 800,
    height: 600,
  },
  large: {
    width: 1600,
    height: 1200,
  },
  "Instagram Story": {
    width: 1080,
    height: 1920,
  },
  "Instagram Post": {
    width: 1080,
    height: 1080,
  },
  "Poster": {
    width: 812,
    height: 1148,
  },
  "FB Banner": {
    width: 1640,
    height: 624,
  },
};

export const settings = {
  engine: require("@mechanic-design/engine-p5"),
  animated: true,
};