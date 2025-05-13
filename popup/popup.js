
document.getElementById('grocySubmit').addEventListener('click', () => {
  const grocyURL = document.getElementById('grocyURL').value.trim();
  const grocyAPIKey = document.getElementById('grocyAPIKey').value.trim();

  // Save the Grocy URL and API key to addon storage
  browser.storage.local.set({
    grocyURL: grocyURL,
    grocyAPIKey: grocyAPIKey
  }).then(() => {
    document.getElementById('grocyStatus').textContent = 'Settings saved';
    document.getElementById('grocyStatus').style.color = 'green';
  }
  ).catch((error) => {
    console.error("Error saving Grocy settings:", error);
    document.getElementById('grocyStatus').textContent = 'Error saving settings';
    document.getElementById('grocyStatus').style.color = 'red';
  });
}
);

document.getElementById('grocyPoll').addEventListener('click', () => {
  // Send a message to the content script to start polling Grocy
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, { type: 'grocyPoll' });
  }).catch((error) => {
    console.error("Error sending message:", error);
  });
  // Close the popup after sending the message
  window.close();
}
);

// When the page loads, check if the Grocy URL and API key are already saved
document.addEventListener('DOMContentLoaded', () => {
  browser.storage.local.get(['grocyURL', 'grocyAPIKey']).then((result) => {
    if (result.grocyURL) {
      document.getElementById('grocyURL').value = result.grocyURL;
    }
    if (result.grocyAPIKey) {
      document.getElementById('grocyAPIKey').value = result.grocyAPIKey;
    }
  }).catch((error) => {
    console.error("Error loading Grocy settings:", error);
  });
});