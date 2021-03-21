const copyBtn = document.getElementById("copy-btn");

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

copyBtn.addEventListener("click", copyCSS);