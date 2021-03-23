//Element variables
const copyBtn = document.getElementById("copy-btn");
const numberInputs = document.querySelectorAll("input[type='number'], select")
const rangeInput = document.querySelector("input[type='range']");

const copyCSS = () => {
  const codeEl = document.getElementsByTagName("code")[0];

  window.navigator.clipboard
    .writeText(codeEl.innerText.trim())
    .then(() => {
        copyBtn.classList.toggle("tooltip") //Toggle tooltip display on
        setTimeout(() => {
            copyBtn.classList.toggle("tooltip") //After 1 sec, toggle tooltip display off
        }, 1000)
    })
    .catch(() => console.error("Error: Unable to copy to clipboard"));
};

const onNumberOrSelectInputChange = (event) => {
    let cssVar, dimension, unit;

    if(event.target.type === "number"){
        const select = document.getElementById(`${event.target.id}-unit`) //Grab the select value to the right in order to get the current unit.
        unit = select.value //rem, px, or %
        dimension = event.target.value //number input value
        cssVar = event.target.id //CSS variable that will get updated in range.css
    }
    else {
        const splitId = event.target.id.split("-") //Get the select ID and split it so that we can infer the corresponding input ID
        const inputId = splitId.slice(0, (splitId.length - 1)).join("-") //The input ID is the same as the select id sans the '-unit'
        const input = document.getElementById(`${inputId}`)

        dimension = input.value
        unit = event.target.value
        cssVar = inputId
    }

    rangeInput.style.setProperty(`--${cssVar}`, `${dimension}${unit}`);
}

//Setting up Event Listeners
copyBtn.addEventListener("click", copyCSS);
Array.from(numberInputs).forEach(input => {
    input.addEventListener("change", onNumberOrSelectInputChange)
})