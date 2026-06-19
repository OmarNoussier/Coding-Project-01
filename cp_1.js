var form = document.getElementById("feedback-form");
var commentsCounter = document.getElementById("comments-counter");
var feedbackDisplay = document.getElementById("feedback-display");

form.addEventListener("input", function (event) {
  var field = event.target; // the actual <input> or <textarea> being typed in

  // Live character counter for the comments box.
  if (field.id === "comments") {
    var count = field.value.length;
    commentsCounter.textContent = count + " characters";
  }

  // As soon as the user types something valid, clear any old error on it.
  if (field.value.trim() !== "") {
    clearError(field);
  }
});

form.addEventListener("mouseover", function (event) {
  var field = event.target.closest(".field");
  if (!field) return;

  var tooltip = field.querySelector(".tooltip");
  tooltip.textContent = field.dataset.tooltip;
  tooltip.classList.add("show");
});

form.addEventListener("mouseout", function (event) {
  var field = event.target.closest(".field");
  if (!field) return;

  var tooltip = field.querySelector(".tooltip");
  tooltip.classList.remove("show"); // hide it again
});

form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading / navigating away

  var nameField = document.getElementById("name");
  var emailField = document.getElementById("email");
  var commentsField = document.getElementById("comments");
  var isValid = true;

  // --- Name: must not be empty ---
  if (nameField.value.trim() === "") {
    showError(nameField, "Please enter your name.");
    isValid = false;
  }

  // --- Email: must not be empty, and must look like an email ---
  if (emailField.value.trim() === "") {
    showError(emailField, "Please enter your email.");
    isValid = false;
  } else if (!isValidEmail(emailField.value.trim())) {
    showError(emailField, "That email doesn't look right.");
    isValid = false;
  }

  // --- Comments: must not be empty ---
  if (commentsField.value.trim() === "") {
    showError(commentsField, "Please leave a comment.");
    isValid = false;
  }

  // If anything failed, stop here. The messages are already on screen.
  if (!isValid) {
    return;
  }

  // Everything is valid -> add the feedback to the page, then reset the form.
  addFeedbackEntry(
    nameField.value.trim(),
    emailField.value.trim(),
    commentsField.value.trim()
  );

  form.reset();
  commentsCounter.textContent = "0 characters";
});

function showError(field, text) {
  var wrapper = field.closest(".field");
  wrapper.classList.add("invalid");
  wrapper.querySelector(".message").textContent = text;
}

// Clear the validation message + invalid styling from a field.
function clearError(field) {
  var wrapper = field.closest(".field");
  wrapper.classList.remove("invalid");
  wrapper.querySelector(".message").textContent = "";
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function addFeedbackEntry(name, email, comments) {
  // Remove the "No feedback yet" note the first time we add an entry.
  var emptyNote = feedbackDisplay.querySelector(".empty-note");
  if (emptyNote) {
    emptyNote.remove();
  }

  // Create the container card.
  var entry = document.createElement("div");
  entry.className = "feedback-entry";

  // Name line.
  var nameEl = document.createElement("p");
  nameEl.className = "entry-name";
  nameEl.textContent = name;

  // Email line.
  var emailEl = document.createElement("span");
  emailEl.className = "entry-email";
  emailEl.textContent = email;

  // Comments line.
  var commentsEl = document.createElement("p");
  commentsEl.className = "entry-comments";
  commentsEl.textContent = comments;

  // Assemble the card and add it to the page.
  entry.appendChild(nameEl);
  entry.appendChild(emailEl);
  entry.appendChild(commentsEl);

  // Newest feedback shows up at the top of the list.
  feedbackDisplay.prepend(entry);

  console.log("New feedback added:", { name: name, email: email });
}
