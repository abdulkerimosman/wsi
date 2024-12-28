const inputField = document.getElementById('number_input');

inputField.addEventListener('input', () => {
  let value = inputField.value;

  // Remove '%' and any non-numeric characters
  value = value.replace(/[^0-9]/g, '');

  // Update the input value with '%' appended
  if (value !== '') {
    inputField.value = `${value}%`;

    // Move the cursor to the correct position (before '%')
    const cursorPosition = value.length;
    inputField.setSelectionRange(cursorPosition, cursorPosition);
  } else {
    inputField.value = ''; // Clear the field if no numeric value
  }
});

inputField.addEventListener('focus', () => {
  // Remove '%' when the input field gains focus
  inputField.value = inputField.value.replace('%', '');
});

inputField.addEventListener('blur', () => {
  // Only append '%' if it is not already present
  if (inputField.value.trim() !== '' && !inputField.value.includes('%')) {
    inputField.value = `${inputField.value}%`;
  }
});
