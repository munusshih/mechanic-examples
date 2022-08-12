import React, { useEffect, useState, useRef } from "react";
import './styles.css';

export const handler = ({ inputs, mechanic }) => {
  const { width, height,
    randomRatio, grid, textSize, randomColor,
    textOne, textTwo, textThree, textFour, title, image, filterOpacity, titleSizeAdjust} = inputs;

  const textColor = randomColor.show? getRandomColor() : randomColor.textColor;
  const titleColor = randomColor.show? getRandomColor() : randomColor.titleColor;
  const backgroundColor = randomColor.show? getRandomColor() : randomColor.backgroundColor;
  const canvasRatio = width/height
  const columnOneRatio = randomRatio.show? parseInt(2 + Math.random() * 8) : randomRatio.columnOneRatio;
  const columnTwoRatio = canvasRatio >= 0.5 ? (randomRatio.show? parseInt(2 + Math.random() * 8) : randomRatio.columnTwoRatio) : 0;
  const columnThreeRatio = canvasRatio >= 0.75 ? (randomRatio.show? parseInt(2 + Math.random() * 8) : randomRatio.columnThreeRatio) : 0;
  const border = randomRatio.show? parseInt(15 + Math.random() * 50) : randomRatio.border;
  const gutter = randomRatio.show? parseInt(15 + Math.random() * 30) : randomRatio.gutter;
  const columnOptions = canvasRatio >= 0.5 ? (canvasRatio >= 0.75 ? 3 : 2) : 1;
  const imageColumn = randomRatio.show? parseInt(1 + Math.random() * columnOptions) : randomRatio.imageColumn;

  const borderRatio = border * width / 1080
  const gutterRatio = gutter * width / 1080

  const ratioSum = (width-borderRatio*2-gutterRatio*(columnOptions-1)) / (columnOneRatio + columnTwoRatio + columnThreeRatio)
  const oneWidth = ratioSum * columnOneRatio
  const twoWidth = ratioSum * columnTwoRatio
  const threeWidth = ratioSum * columnThreeRatio

  let chooseW = [oneWidth+borderRatio, twoWidth+gutterRatio, threeWidth+borderRatio+borderRatio*0.5]

  chooseW[0] = canvasRatio >= 0.5 ? oneWidth+borderRatio+gutterRatio*0.5 : oneWidth+borderRatio*2
  chooseW[1] = canvasRatio >= 0.75 ? twoWidth+gutterRatio : twoWidth+gutterRatio*0.5+borderRatio

  const chooseX = [0, borderRatio+gutterRatio*0.5+oneWidth, borderRatio+gutterRatio*1.5+oneWidth+twoWidth]
  const cropWidth = chooseW[imageColumn-1]
  const cropX = chooseX[imageColumn-1]

  const fullHeight = (height-borderRatio*2)
  const textSizeRatio = (textSize - (canvasRatio-0.5)*2) * width / 1080 / Math.min(canvasRatio, 1)
  const titleSize = (textSize- title.length*0.8 + titleSizeAdjust) * 10 * width / 1080 / Math.min(canvasRatio, 1)
  const titleAngle = (Math.round(Math.random()) * 2 - 1) * Math.random() * (60 / canvasRatio)

  let columnClass = grid? (brightnessByColor(backgroundColor)>127? 'column darkGrid' : 'column lightGrid') : 'column'
  let GridColor = brightnessByColor(backgroundColor)>127? '#000' : '#fff'

  const bigTextStyle = {
    color: titleColor,
    fontSize: textSizeRatio*1.5,
    fontFamily: "Object Sans",
    whiteSpace: 'pre-wrap',
    overflowWrap: "anywhere",
  };

  const textStyle = {
    color: textColor,
    fontSize: textSizeRatio,
    fontFamily: "Object Sans",
    whiteSpace: 'pre-wrap',
    overflowWrap: "anywhere",
  };

  function brightnessByColor (color) {
    var color = "" + color, isHEX = color.indexOf("#") == 0, isRGB = color.indexOf("rgb") == 0;
    if (isHEX) {
      const hasFullSpec = color.length == 7;
      var m = color.substr(1).match(hasFullSpec ? /(\S{2})/g : /(\S{1})/g);
      if (m) var r = parseInt(m[0] + (hasFullSpec ? '' : m[0]), 16), g = parseInt(m[1] + (hasFullSpec ? '' : m[1]), 16), b = parseInt(m[2] + (hasFullSpec ? '' : m[2]), 16);
    }
    if (isRGB) {
      var m = color.match(/(\d+){3}/g);
      if (m) var r = m[0], g = m[1], b = m[2];
    }
    if (typeof r != "undefined") return ((r*299)+(g*587)+(b*114))/1000;
  }

  function getRandomColor() {
    return '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6)
  }

  const [href, setHref] = useState("");

  useEffect(() => {
    let reader;
    if (image) {
      reader = new FileReader();

      reader.readAsDataURL(image);

      reader.onload = function () {
        setHref(reader.result);
      };

      reader.onerror = function () {
        console.error(reader.error);
      };
    }
    return () => {
      if (reader) {
        reader.abort();
      }
    };
  }, [image]);

  useEffect(() => {
    if (!image || href !== "") {
      mechanic.done();
    }
  }, [image, href]);

  return (
    <svg width={width} height={height}>
      <rect fill={backgroundColor} width={width} height={height} />

      <defs>
        {/* mask to crop the image into a half circle */}
        <mask id="image-mask">
        <rect fill="#fff" width={cropWidth} height={height} x={Math.max(0, width/2-cropWidth)}/>
        </mask>
      </defs>

        {/* the image that will be cropped */}
      <image width="100%" height="100%" transform={`translate(${cropX-Math.max(0, width/2-cropWidth)} 0) `}
          preserveAspectRatio="xMidYMid slice"
          href={href? href : "https://images.unsplash.com/photo-1568214697537-ace27ffd6cf3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1888&q=80"}
          mask="url(#image-mask)"/>

      <rect fill="#000" width={cropWidth} height={height} x={cropX}
            style={{mixBlendMode: "multiply"}} opacity={filterOpacity/100}/>


      {/* lines */}
      {grid
        ? <></>
        : <><rect fill="none" width={0.1} height={height + 40} x={cropX - gutterRatio / 2} y={-20} stroke={GridColor} strokeWidth="2" strokeOpacity="0.7" />
        <rect fill="none" width={0.1} height={height + 40} x={cropX + cropWidth + gutterRatio / 2} y={-20} stroke={GridColor} strokeWidth="2" strokeOpacity="0.7" /></>

      }

      <foreignObject width={oneWidth} height={fullHeight} x={borderRatio} y={borderRatio}>
        <div className={columnClass} >
          <div className="top" style={bigTextStyle}>
              <p>{textOne}</p>
              {canvasRatio >= 0.5?<></> :
              <><br /><p>{textFour}</p></>}
          </div>

          <div className="bottom" style={textStyle}>
              <p>{textTwo}</p>
              {canvasRatio >= 0.5?<></> :
              <><br />
            <p>{textThree}</p></>}
          </div>
        </div>
      </foreignObject>

      <foreignObject width={twoWidth} height={fullHeight} x={chooseX[1]+gutterRatio*0.5} y={borderRatio}>
        <div className={columnClass} style={textStyle}>
          {canvasRatio >= 0.75?
          <></> :
          <div className="top" style={bigTextStyle}>
            <p>{textFour}</p>
          </div>}

          <div className="bottom" style={textStyle}>
              <p>{textThree}</p>
          </div>
        </div>
      </foreignObject>

      <foreignObject width={threeWidth} height={fullHeight} x={chooseX[2]+borderRatio*0.5} y={borderRatio}>
        <div className={columnClass}>
          <div className="top" style={bigTextStyle}>
              <p>{textFour}</p>
          </div>
        </div>
      </foreignObject>

      {/* title */}
      <text
            x={width / 2}
            y={height/ 2}
            textAnchor="middle"
            dominantBaseline="central"
            fill={titleColor}
            fontWeight="regular"
            fontFamily="Object Sans Slanted"
            transform={`rotate(${titleAngle}, ${width/2}, ${height/2})`}
            fontSize={titleSize}
            letterSpacing={-titleSize/20}
          >
            {title.toUpperCase()}
        </text>
    </svg>
  );
};

export const inputs = {
  width: {
    type: "number",
    default: 1000,
  },
  height: {
    type: "number",
    default: 1000,
  },
  randomRatio: {
    type: "groupToggle",
    default: true,
    label: "Random Ratio",
    inputs: {
      columnOneRatio: {
        type: "number",
        slider: true,
        default: 2,
        min: 1,
        max: 10,
        step: 1,
      },
      columnTwoRatio: {
        type: "number",
        slider: true,
        default: 2,
        min: 1,
        max: 10,
        step: 1,
      },
      columnThreeRatio: {
        type: "number",
        slider: true,
        default: 1,
        min: 1,
        max: 10,
        step: 1,
      },
      border: {
        type: "number",
        slider: true,
        default: 15,
        min: 1,
        max: 100,
        step: 1,
      },
      gutter: {
        type: "number",
        slider: true,
        default: 15,
        min: 1,
        max: 100,
        step: 1,
      },
      imageColumn: {
        type: "number",
        slider: true,
        default: 1,
        min: 1,
        max: 3,
        step: 1,
      }
    },
  },
  randomColor : {
    type: "groupToggle",
    default: false,
    label: "Random Color",
    inputs: {
      backgroundColor: {
        type: "color",
        model: "hex",
        default: "#000000",
      },
      textColor: {
        type: "color",
        model: "hex",
        default: "#ffffff",
      },
      titleColor: {
        type: "color",
        model: "hex",
        default: "#E94825",
      },
    },
  },
  image: {
    type: "image",
    multiple: false,
  },
  filterOpacity: {
    type: "number",
    default: 20,
    min: 0,
    max: 100,
    step: 1,
    slider: true,
  },
  textSize: {
    type: "number",
    default: 20,
  },
  titleSizeAdjust: {
    type: "number",
    slider: true,
    default: 0,
    min: -5,
    max: 15,
    step: 1,
  },
  title : {
    type: "text",
    default: "Mechanic"
  },
  textOne : {
    type: "text",
    default: "MUNUS SHIH"
  },
  textTwo : {
    type: "text",
    default: "MECHANIC.DESIGN INFO@MECHANIC.DESIGN"
  },
  textThree : {
    type: "text",
    default: "@MECHANIC 781 12TH ST, 8A, NEW YORK, NY 10003"
  },
  textFour : {
    type: "text",
    default: "MUNUS@MECHANIC.ORG +1 876.9834.9823"
  },
  grid: {
    type: "boolean",
    default: false,
  },
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
  "Banner": {
    width: 1640,
    height: 624,
  },
  "Ticket": {
    width: 394,
    height: 1126,
  },
};

export const settings = {
  engine: require("@mechanic-design/engine-react"),
  showMultipleExports: true,
};
