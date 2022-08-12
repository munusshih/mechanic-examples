import React, { useEffect, useState, useRef } from "react";
import "./styles.css";

export const handler = ({ inputs, mechanic }) => {
  const {
    width, height, textSizeAjust, description,
    tagline,
    colorOne, colorTwo, textColor, image, filterOpacity
  } = inputs;

  // min to determine the size of the circle
  const size = Math.min(width, height)
  const circleRadius = size/2;
  const circleRadiusRotate = useRef(Math.random() * 360).current;

  const raw = tagline.split(" ");
  let holder = []; // Output
  for (var i = 0, j = raw.length -1 ; i <= j; i++) { // Iterate all but last (last can never be glued to non-existing next)
    var curr = raw[i]; // This piece
    var next = raw[i+1]
    if(next){
      if (curr.length + next.length < 7) { // If its length is smaller than 3
      curr += ' ' + raw[++i]; // ... glue with next and skip next (increment i)
    }
  }
    holder.push(curr); // Add to output
  }
  const lines = [...holder]

  // determine the loggest word of the setence to resize the font
  const maxLength = Math.max(...(lines.map(el => el.length)));
  const fontSize = (textSizeAjust + 100 - Math.max(0,(lines.length - 4))*5 - Math.max(0,maxLength-2)*2.5)*size/850
  const lineHeight = fontSize
  const firstLine = height / 2 - size/20 - lineHeight * ((lines.length - 2) / 2);
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

      <defs>
        {/* mask to crop the image into a half circle */}
        <mask id="image-mask">
        <g transform={`translate(${width/2} ${height/2}) `} >
        <path d={`M ${-circleRadius} 0 A ${circleRadius} ${circleRadius}, 0, 0, 0, ${circleRadius} 0 Z`} fill="white"/>
        </g>
        </mask>
      </defs>

        {/* the other half of the circle */}
      <g transform={`translate(${width/2} ${height/2}) rotate(${circleRadiusRotate})`} >
        <path
          d={`M ${circleRadius} 0
          A ${circleRadius} ${circleRadius}, 0, 0, 0, ${-circleRadius} 0 Z`}
          fill={colorOne} />
      </g>

      <g transform={`translate(${width/2} ${height/2}) rotate(${circleRadiusRotate})`} >

        {/* the image that will be cropped */}
      <image width="100%" height="100%" transform={`translate(${-width/2} ${-height/2})`}
          preserveAspectRatio="xMidYMid slice"
          href={href? href: "https://images.unsplash.com/photo-1648254795567-0112e5d29a97?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"}
          mask="url(#image-mask)"/>

        {/* the filter half circle with adjustable opacity */}
      <path d={`M ${-circleRadius} 0
         A ${circleRadius} ${circleRadius}, 0, 0, 0, ${circleRadius} 0 Z`}
         fill={colorTwo} style={{mixBlendMode: "multiply"}} opacity={filterOpacity/100}/>
      </g>


        {/* using map to print all the words */}
      {lines.map((line, index) => {
        return (
          <text
            key={index}
            x={width / 2}
            y={firstLine + index * lineHeight}
            textAnchor="middle"
            letterSpacing={-fontSize*0.05}
            fill={textColor}
            fontWeight="bold"
            fontFamily="Object Sans"
            fontSize={fontSize}
          >
            {line.toUpperCase()}
          </text>
        );
      })}

        {/* the description */}
        <text
            x={width / 2}
            y={height/ 2 + size/2 - size*0.1}
            textAnchor="middle"
            fill={textColor}
            fontWeight="regular"
            fontFamily="Object Sans"
            fontSize={30*size/850}
          >
            {description}
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
    default: "*mechanic* this sticker!",
  },
  description: {
    type: "text",
    default: "mechanic.design",
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
    default: 0,
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
  showMultipleExports: true,
};
