let addIngredientsBtn = document.getElementById("addIngredientsBtn");
let ingredientList = document.querySelector(".ingredientList");
let ingredeintDiv = document.querySelectorAll(".ingredeintDiv")[0];

addIngredientsBtn?.addEventListener("click", function () {
  let newIngredients = ingredeintDiv.cloneNode(true);
  let input = newIngredients.getElementsByTagName("input")[0];
  input.value = "";
  ingredientList.appendChild(newIngredients);
});

let imageAiForm = document.getElementById("image-ai-form");
let imageAiResult = document.getElementById("image-ai-result");

imageAiForm?.addEventListener("submit", submitAiForm);

async function submitAiForm(e) {
  e.preventDefault();

  // Get the file input and result container
  const fileInput = document.getElementById("ai-form-file-input");

  // Check if a file is selected
  if (fileInput.files.length === 0) {
    imageAiResult.textContent = "Please select an image to upload.";
    return;
  }

  // Prepare the FormData
  const formData = new FormData(e.target); // 'this' can be replaced with 'e.target' for clarity

  try {
    // Send the request to the server
    const response = await fetch("/ai/predict", {
      method: "POST",
      body: formData, // Headers are not needed for FormData, browser sets them automatically including `multipart/form-data`
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Process the response
    const data = await response.json();
    imageAiResult.innerHTML = data.prediction; // Display the result
    // clear the form
    imageAiForm.reset();
  } catch (error) {
    console.error("Error submitting the form", error);
    imageAiResult.textContent = "Failed to get prediction from the server.";
  }
}
