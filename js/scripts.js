/*********** Element variables ***********/
const copyBtn = document.getElementById("copy-btn");
const colorInputs = document.querySelectorAll("input[type='color']");
const numberInputs = document.querySelectorAll("input[type='number']");
const selectInputs = document.querySelectorAll("select");
const rangeInput = document.querySelector("input[type='range']");
const codeEl = document.getElementsByTagName("code")[0];

/*********** Event handlers ***********/
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

const handleNumberInputChange = (event) => {
  //Grab the select value to the right in order to get the current unit.
  const select = Array.from(selectInputs).find(
    (select) => select.id === `${event.target.id}-unit`
  );
  const unit = select.value; //rem, px, or %
  const dimension = event.target.value; //number input value
  const cssVar = event.target.id; //CSS variable that will get updated in range.css

  rangeInput.style.setProperty(`--${cssVar}`, `${dimension}${unit}`);
  generateStyles();
};

const handleSelectChange = (event) => {
  const numInput = Array.from(numberInputs).find((input) =>
    event.target.id.includes(input.id)
  );
  const unit = event.target.value;
  const dimension = numInput.value;
  const cssVar = numInput.id;

  rangeInput.style.setProperty(`--${cssVar}`, `${dimension}${unit}`);
  generateStyles();
};

const handleColorInputChange = (event) => {
  const cssVar = event.target.id;
  rangeInput.style.setProperty(`--${cssVar}`, event.target.value);
  generateStyles();
};

/*********** Set up Event Listeners ***********/
window.addEventListener("load", (event) => generateStyles());
copyBtn.addEventListener("click", copyCSS);
Array.from(colorInputs).forEach((input) => {
  input.addEventListener("input", handleColorInputChange);
});
Array.from(numberInputs).forEach((input) => {
  input.addEventListener("change", handleNumberInputChange);
});
Array.from(selectInputs).forEach((select) => {
  select.addEventListener("change", handleSelectChange);
});

/*********** Util helper methods ***********/
const getUnit = (inputId) => {
  const selectMatch = Array.from(selectInputs).find((select) =>
    select.id.includes(inputId)
  );
  return selectMatch?.value;
};

const getCSSMappingsObject = () => {
  const numberAndColorInputs = [...numberInputs, ...colorInputs];
  return numberAndColorInputs.reduce((acc, currentValue) => {
    const id = `${currentValue.id}`;
    const unit = getUnit(currentValue.id);
    const cssValue = unit ? `${currentValue.value}${unit}` : currentValue.value;
    return { ...acc, [id]: cssValue };
  }, {});
};

const calculateCenter = (trackHeight, thumbHeight) => {
  const remToPx = (value) => parseFloat(value) * 16;
  const trackHeightNum = trackHeight.includes("rem")
    ? remToPx(trackHeight)
    : parseFloat(trackHeight);
  const thumbHeightNum = thumbHeight.includes("rem")
    ? remToPx(thumbHeight)
    : parseFloat(thumbHeight);
  return `${trackHeightNum / 2 - thumbHeightNum / 2}px`;
};

const generateStyles = () => {
  const cssMappings = getCSSMappingsObject();

  codeEl.innerText = `
/*********** Baseline, reset styles ***********/
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  width: ${cssMappings["track-width"]};
}

/* Removes default focus */
input[type="range"]:focus {
  outline: none;
}

/******** Chrome, Safari, Opera and Edge Chromium styles ********/
/* slider track */
input[type="range"]::-webkit-slider-runnable-track {
  background-color: ${cssMappings["track-color"]};
  border-radius: ${cssMappings["track-border-radius"]};
  height: ${cssMappings["track-height"]};
}

/* slider thumb */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  margin-top: ${calculateCenter(
    `${cssMappings["track-height"]}`,
    `${cssMappings["thumb-height"]}`
  )}; /* Centers thumb on the track */
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
  border: none; /*Removes extra border that FF applies*/
  border-radius: ${cssMappings["thumb-border-radius"]};
  height: ${cssMappings["thumb-height"]};
  width: ${cssMappings["thumb-width"]};
}

input[type="range"]:focus::-moz-range-thumb{
  outline: 3px solid ${cssMappings["thumb-color"]};
  outline-offset: 0.125rem;
}
`;
};
