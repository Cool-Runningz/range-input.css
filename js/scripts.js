const copyBtn = document.getElementById("copy-btn");

const copyCode = () => {
  const codeEl = document.getElementsByTagName("code")[0];
  console.log("CopyCode: ", codeEl);
  window.navigator.clipboard
    .writeText(codeEl.innerText.trim())
    .then(() => {
      //TODO: Display tooltip indicating content was copied
      console.log("Copied to clipboard");
    })
    .catch(() => console.error("Error: Unable to copy to clipboard"));
};

copyBtn.addEventListener("click", copyCode);
