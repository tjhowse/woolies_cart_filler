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
