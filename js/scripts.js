//Element variables
const copyBtn = document.getElementById("copy-btn");
const colorInputs = document.querySelectorAll("input[type='color']");
const numberAndSelectInputs = document.querySelectorAll(
  "input[type='number'], select"
);
const rangeInput = document.querySelector("input[type='range']");
const codeEl = document.getElementsByTagName("code")[0];

const copyCSS = () => {
  navigator.clipboard
    .writeText(codeEl.innerText.trim())
    .then(() => {
      copyBtn.classList.toggle("tooltip"); //Toggle tooltip display on
      setTimeout(() => {
        copyBtn.classList.toggle("tooltip"); //After 1 sec, toggle tooltip display off
      }, 1000);
    })
    .catch(() => console.error("Error: Unable to copy to clipboard"));
};

const onNumberOrSelectInputChange = (event) => {
  let cssVar, dimension, unit;

  if (event.target.type === "number") {
    const select = document.getElementById(`${event.target.id}-unit`); //Grab the select value to the right in order to get the current unit.
    unit = select.value; //rem, px, or %
    dimension = event.target.value; //number input value
    cssVar = event.target.id; //CSS variable that will get updated in range.css
  } else {
    const splitId = event.target.id.split("-"); //Get the select ID and split it so that we can infer the corresponding input ID
    const inputId = splitId.slice(0, splitId.length - 1).join("-"); //The input ID is the same as the select id sans the '-unit'
    const input = document.getElementById(`${inputId}`);

    dimension = input.value;
    unit = event.target.value;
    cssVar = inputId;
  }

  rangeInput.style.setProperty(`--${cssVar}`, `${dimension}${unit}`);
  generateStyles();
};

const onColorInputChange = (event) => {
  const cssVar = event.target.id;
  rangeInput.style.setProperty(`--${cssVar}`, event.target.value);
  generateStyles();
};

//Setting up Event Listeners
window.onload = function () {
  generateStyles();
};
copyBtn.addEventListener("click", copyCSS);
Array.from(numberAndSelectInputs).forEach((input) => {
  input.addEventListener("change", onNumberOrSelectInputChange);
});
Array.from(colorInputs).forEach((input) => {
  input.addEventListener("input", onColorInputChange);
});

const getUnit = (inputId) => {
  const selectInputs = Array.from(numberAndSelectInputs).filter((input) =>
    input.type.includes("select")
  );
  const selectMatch = selectInputs.find((select) =>
    select.id.includes(inputId)
  );
  return selectMatch?.value;
};

const getCSSMappingsObject = () => {
  const numberInputs = Array.from(numberAndSelectInputs).filter(
    (input) => input.type === "number"
  );
  const numberAndColorInputs = [...numberInputs, ...Array.from(colorInputs)];
  return numberAndColorInputs.reduce((acc, currentValue) => {
    const id = `${currentValue.id}`;
    const unit = getUnit(currentValue.id);
    const cssValue = unit ? `${currentValue.value}${unit}` : currentValue.value;
    return { ...acc, [id]: cssValue };
  }, {});
};

const generateStyles = () => {
  const cssMappings = getCSSMappingsObject();

  codeEl.innerText = `
/*********** Baseline, reset styles ***********/
input[type="range"] {
  -webkit-appearance: none;
  cursor: pointer;
  background: transparent;
  width: ${cssMappings["track-width"]};
}

/* Removes default focus */
input[type="range"]:focus {
  outline: none;
}

/******** Chrome, Safari, Opera and Edge styles ********/
/* slider track */
input[type="range"]::-webkit-slider-runnable-track {
  background-color: ${cssMappings["track-color"]};
  border-radius: ${cssMappings["track-border-radius"]};
  height: ${cssMappings["track-height"]};
}

/* slider thumb */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  margin-top: -4px; /* Centers thumb on the track */
  background-color: ${cssMappings["thumb-color"]};
  border-radius: ${cssMappings["thumb-border-radius"]};
  height: ${cssMappings["thumb-height"]};
  width: ${cssMappings["thumb-width"]};
}

input[type="range"]:focus::-webkit-slider-thumb {
  outline: 3px solid ${cssMappings["thumb-color"]};
  outline-offset: 0.125rem;
}

/*********** Firefox styles ***********/
/* slider track */
input[type="range"]::-moz-range-track {
  background-color: ${cssMappings["track-color"]};
  border-radius: ${cssMappings["track-border-radius"]};
  height: ${cssMappings["track-height"]};
}

/* slider thumb */
input[type="range"]::-moz-range-thumb {
  background-color: ${cssMappings["thumb-color"]};
  border-radius: ${cssMappings["thumb-border-radius"]};
  height: ${cssMappings["thumb-height"]};
  width: ${cssMappings["thumb-width"]};
}

input[type="range"]:focus::-moz-range-thumb{
  outline: 3px solid ${cssMappings["thumb-color"]};
  outline-offset: 0.125rem;
}

/*********** IE and legacy Edge styles ***********/
/* slider track */
input[type="range"]::-ms-track {
  color: transparent; /*remove default tick marks*/
  height: ${cssMappings["track-height"]};

  /*leave room for the larger thumb to overflow with a transparent border */
  border-color: transparent;
  border-width: 7px 0;
}
input[type="range"]::-ms-fill-lower,
input[type="range"]::-ms-fill-upper {
  background-color: ${cssMappings["track-color"]};
  border-radius: ${cssMappings["track-border-radius"]};
}
/* slider thumb */
input[type="range"]::-ms-thumb {
  margin-top: 0;
  background-color: ${cssMappings["thumb-color"]};
  border-radius: ${cssMappings["thumb-border-radius"]};
  height: ${cssMappings["thumb-height"]};
  width: ${cssMappings["thumb-width"]};
}
input[type="range"]:focus::-ms-thumb {
  margin-left: 4px; /** Offset the border from getting hidden at starting position */
  margin-right: 4px; /** Offset the border from getting hidden at ending position */
  outline: 3px solid ${cssMappings["thumb-color"]};
  outline-offset: 0.125rem;
}
`;
};
