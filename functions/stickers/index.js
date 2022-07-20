import React, { useEffect, useState, useRef } from "react";
import "./styles.css";

export const handler = ({ inputs, mechanic }) => {
  const {
    width, height, textSizeAjust,
    tagline,
    colorOne, colorTwo, textColor, image, filterOpacity
  } = inputs;

  // circle
  const size = Math.min(width, height)
  const circleRadius = size/2;
  const circleRadiusRotate = Math.random()*360
  const lines = tagline.split(" ");
  const maxLength = Math.max(...(lines.map(el => el.length)));
  const fontSize = textSizeAjust + (100 - Math.max(0,(lines.length - 4))*5 - Math.max(0,maxLength-2)*2.5)*size/850
  const lineHeight = fontSize
  const firstLine = size / 2 - lineHeight * ((lines.length - 2) / 2);

  // the text too long
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

      {/* The mechanic mini-logo */}


      <defs>
        <mask id="image-mask">
        <g
        transform={`translate(${width/2} 0) `}
        >
        <path
        d={`M ${-circleRadius} 0
        A ${circleRadius} ${circleRadius}, 0, 0, 0, ${circleRadius} 0 Z`} fill="white"
        />
        </g>
        </mask>

      </defs>

      <g
        transform={`translate(${width/2} ${height/2}) rotate(${circleRadiusRotate})`}
      >
        <path
          d={`M ${circleRadius} 0
          A ${circleRadius} ${circleRadius}, 0, 0, 0, ${-circleRadius} 0 Z`}
          fill={colorOne}
        />
      </g>

      <g
        transform={`translate(${width/2} ${height/2}) rotate(${circleRadiusRotate})`}
      >
      <image width="100%" height="100%" transform={`translate(${-circleRadius} 0)`}
          preserveAspectRatio="xMidYMid slice"
          href={href} mask="url(#image-mask)"/>
      <path
            d={`M ${-circleRadius} 0
         A ${circleRadius} ${circleRadius}, 0, 0, 0, ${circleRadius} 0 Z`}
            fill={colorTwo} style={{mixBlendMode: "multiply"}} opacity={filterOpacity/100}/>
      </g>


      {lines.map((line, index) => {
        return (
          <text
            key={index}
            x={width / 2}
            y={firstLine + index * lineHeight}
            textAnchor="middle"
            fill={textColor}
            fontWeight="bold"
            fontFamily="Object Sans"
            fontSize={fontSize}
          >
            {line.toUpperCase()}
          </text>
        );
      })}

        <text
            x={width / 2}
            y={height*0.9}
            textAnchor="middle"
            fill={textColor}
            fontWeight="regular"
            fontFamily="Object Sans"
            fontSize={30*size/850}
          >
            mechanic.design
        </text>
    </svg>
  );
};

export const inputs = {
  width: {
    type: "number",
    default: 850,
  },
  height: {
    type: "number",
    default: 850,
  },
  tagline: {
    type: "text",
    default: "mechanic this sticker",
  },
  textSizeAjust: {
    type: "number",
    default: 0,
    min: 0,
    max: 50,
    step: 1,
    slider: true,
  },
  colorOne: {
    type: "color",
    model: "hex",
    default: "#E94225",
  },
  colorTwo: {
    type: "color",
    model: "hex",
    default: "#002EBB",
  },
  textColor: {
    type: "color",
    model: "hex",
    default: "#ffffff",
  },
  filterOpacity: {
    type: "number",
    default: 100,
    min: 0,
    max: 100,
    step: 1,
    slider: true,
  },
  image: {
    type: "image",
    multiple: false,
  },
};

export const settings = {
  engine: require("@mechanic-design/engine-react"),
  optimize: false,
};
