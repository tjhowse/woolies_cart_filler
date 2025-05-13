document.getElementById('submit').addEventListener('click', () => {
  const csv = document.getElementById('csvText').value.trim();
  if (!csv) {
    alert("Please paste CSV data.");
    return;
  }

  const rows = csv.split('\n').map(line => line.split(',').map(s => s.trim()));
  const isHeader = isNaN(parseInt(rows[0][1]));
  const data = isHeader ? rows.slice(1) : rows;

  // Send the data to the content script
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, { type: 'csvData', data });
  }).catch((error) => {
    console.error("Error sending message:", error);
  });
  // Close the popup
  window.close();
});

document.getElementById('grocySubmit').addEventListener('click', () => {
  const grocyURL = document.getElementById('grocyURL').value.trim();
  const grocyAPIKey = document.getElementById('grocyAPIKey').value.trim();

  // Save the Grocy URL and API key to addon storage
  browser.storage.local.set({
    grocyURL: grocyURL,
    grocyAPIKey: grocyAPIKey
  }).then(() => {
    alert("Grocy URL and API key saved.");
  }
  ).catch((error) => {
    console.error("Error saving Grocy settings:", error);
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
}
);

// When the page loads, check if the Grocy URL and API key are already saved
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('grocyURL').value = "jizz";
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