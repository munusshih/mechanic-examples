export const handler = ({
  inputs,
  mechanic,
  sketch
}) => {
  const {
    width,
    height,
    tagline,
    backgroundImage,
    textSizeAjust,
    color1,
    color2,
    backgroundColor,
    turns
  } =
  inputs;

  const border = 3
  const raw = tagline.split(" ");
  const bgImage = {
    x: width / 2 + Math.random() * width / 2,
    y: Math.random() * height,
    num: parseInt(Math.random() * 30),
    spaceX: (10 + Math.random() * -20) * 10,
    spaceY: (10 + Math.random() * -20) * 30,
    size: width/4 + Math.random()*width/4*3,
    rotate: Math.random()*Math.PI,
    strokeWeight :  2 + Math.random()*5
  }
  let angle = 0;
  let holder = []; // Output
  const maxText = parseInt(mapRange(height/width, 1.3, 0.5, 12, 20))

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
  const maxLine = Math.floor((height / (textSizeAjust + 90) * width / 850))
  const fontSize = (textSizeAjust + 150 - Math.max(0, (lines.length - maxLine)) * 7 - Math.max(0, maxLength) * 5) * width / 850
  const lineHeight = fontSize
  const circleSize = fontSize * 0.8
  const firstLine = (border) / 100 * width + lineHeight;

  sketch.setup = () => {
    sketch.createCanvas(width, height);
    sketch.colorMode(sketch.HSB)
    sketch.rectMode(sketch.CENTER)
  };

  sketch.draw = () => {
    sketch.background(backgroundColor);

    // background Image
    switch (backgroundImage) {
      case 'files':
        fileShape(bgImage.x, bgImage.y, bgImage.num);
        break;

      case 'circles':
        circleShape(bgImage.x, bgImage.y, bgImage.size, bgImage.rotate, bgImage.num, bgImage.strokeWeight);
        break;

      case 'export':
        exportShape(bgImage.x, bgImage.y, bgImage.num, bgImage.strokeWeight);
        break;

      default:
        break;
    }

    sketch.fill('white');

    for (let i = 0; i < lines.length; i++) {
      let e = lines[i]

      if (lines[i].includes("O")) {
        let arr = lines[i].split(/(O)/g);
        let widthSum = 0;

        for (let j = 0; j < arr.length; j++) {
          let x = border / 100 * width + widthSum;
          let y = firstLine + i * lineHeight;

          if (arr[j] != "O") {
            sketch.fill(color1);
            sketch.noStroke()
            sketch.textFont('PPObjectSans-Heavy');
            sketch.textSize(fontSize);
            sketch.text(arr[j].toUpperCase(), x, y);
          } else {
            // 				circles
            sketch.fill(color1);
            sketch.noStroke()
            sketch.arc(x + circleSize / 2 + 1.5 * (width+height) / 1700, y - circleSize / 2 + 2 * (width+height) / 1700,
              circleSize, circleSize, 0 + sketch.frameCount / 30 + i * 10, sketch.PI + sketch.frameCount / 30 + i * 10);
            sketch.fill(color2);
            sketch.arc(x + circleSize / 2 + 1.5 * (width+height) / 1700, y - circleSize / 2 + 2 * (width+height) / 1700,
              circleSize, circleSize, sketch.PI + sketch.frameCount / 30 + i * 10, sketch.PI * 2 + sketch.frameCount / 30 + i * 10);
          }

          widthSum += sketch.textWidth(arr[j]);
        }
      } else {
        sketch.fill('white');
        sketch.textSize(fontSize)
        sketch.textFont('PPObjectSans-Heavy');
        sketch.text(e.toUpperCase(), border / 100 * width, firstLine + i * lineHeight);
      }

      sketch.textFont('IBM Plex Mono Light');
      sketch.textSize(lineHeight / 2.5);
      sketch.noStroke()
      sketch.fill(color1)
      sketch.text("MECHANIC.DESIGN", border / 100 * width, height - lineHeight / 2-border);

    }

    if (angle < turns * 2 * Math.PI) {
      mechanic.frame();
      angle += (2 * Math.PI) / 100;
    } else {
      mechanic.done();
    }
  };

  function fileShape(x, y, num) {
    sketch.push()
    sketch.translate(x, y)
    sketch.scale(0.8)
    for (let i = 0; i < num; i++) {
      sketch.push()
      sketch.translate(i * bgImage.spaceX, i * bgImage.spaceY)
      sketch.fill("rgba(0, 0, 0, 0)")
      sketch.stroke('rgba(0,0,0,0)')
      sketch.strokeCap(sketch.PROJECT);
      sketch.strokeJoin(sketch.MITER);

      sketch.fill(sketch.hue(backgroundColor), sketch.saturation(backgroundColor) - 70, 100)

      sketch.stroke(backgroundColor)
      sketch.strokeWeight(4)
      sketch.beginShape();
      sketch.vertex(266.855, 63.3298);
      sketch.vertex(266.892, 63.3715);
      sketch.vertex(266.93, 63.4111);
      sketch.vertex(320.032, 117.673);
      sketch.vertex(320.032, 231);
      sketch.vertex(2.00014, 231);
      sketch.vertex(2.00015, 2.71483);
      sketch.vertex(213.781, 2.71484);
      sketch.vertex(266.855, 63.3298);
      sketch.endShape();
      sketch.stroke(backgroundColor)
      sketch.strokeWeight(4)
      sketch.beginShape();
      sketch.vertex(165.656, 48.2275);
      sketch.vertex(165.656, 185.487);
      sketch.endShape()
      sketch.fill(backgroundColor)
      sketch.translate(126.701, 48.2275);
      sketch.rotate(1.5707963267948966);
      sketch.translate(-126.701, -48.2275);
      sketch.beginShape();
      sketch.vertex(126.701, 48.2275);
      sketch.vertex(263.96, 48.2275);
      sketch.quadraticVertex(263.96, 48.2275, 263.96, 48.2275);
      sketch.vertex(263.96, 132.6948);
      sketch.quadraticVertex(263.96, 132.6948, 263.96, 132.6948);
      sketch.vertex(126.701, 132.6948);
      sketch.quadraticVertex(126.701, 132.6948, 126.701, 132.6948);
      sketch.vertex(126.701, 48.2275);
      sketch.quadraticVertex(126.701, 48.2275, 126.701, 48.2275);
      sketch.endShape();
      sketch.pop()
    }
    sketch.pop()
  }

  function circleShape(x, y, size, rotate, num, strokeWeight) {
    for (let i = 0; i < num; i++) {
    sketch.push()
    sketch.noFill()
    sketch.strokeWeight(strokeWeight)
    sketch.translate(x, y)
    sketch.translate(0, i *size*1.1)
    sketch.rotate(rotate)
    sketch.stroke(sketch.hue(backgroundColor), sketch.saturation(backgroundColor) - 30, 100)
    sketch.arc(0, 0, size, size, 0, sketch.PI, sketch.PIE)
    sketch.arc(0, 0, size, size, sketch.PI, sketch.PI*2)
    sketch.pop()
  }
  }

  function exportShape(x, y, num, strokeWeight) {
    sketch.push()
    sketch.noFill()
    sketch.stroke(sketch.hue(backgroundColor)+180, 20, 100)
    sketch.strokeWeight(4)
    sketch.translate(x, y)
    sketch.rotate(Math.PI/2)
    sketch.rect(0, 0, 1000/3.5, 90, 1000/2);
    sketch.rect(1000/3.5 + 125, 0, 1000/3.5 + 25, 90, 1000/2+50);
    sketch.rect(1000/3.5 + 1000/3.5 + 220, 0, 1000/3.5 - 45, 90, 1000/2);

    sketch.noStroke()
    sketch.fill(sketch.hue(backgroundColor)+180, 20, 100)
    sketch.textFont('PPObjectSans-Regular')
    sketch.textSize(1000/25)
    sketch.text('New file           >           Mechanic          >          Export', -80, 15)
    sketch.pop()
  }

  function mapRange (value, a, b, c, d) {
    // first map value from (a..b) to (0..1)
    value = (value - a) / (b - a);
    // then map it from (0..1) to (c..d) and return it
    let output = Math.max(Math.min(c + value * (d - c), d), c)
    return output;
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
  turns: {
    type: "number",
    default: 3,
  },
  tagline: {
    type: "text",
    default: "JavaScript functions are the main building block of Mechanic, and a project can have one or more design function.",
  },
  textSizeAjust: {
    type: "number",
    default: 0,
    min: -50,
    max: 50,
    step: 1,
    slider: true,
  },
  backgroundColor: {
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
  backgroundImage: {
    type: "text",
    default: 'files',
    options: ['files', 'circles', 'export']
  }
};

export const presets = {
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