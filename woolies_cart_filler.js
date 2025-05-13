document.body.style.border = "5px solid red";

const url = `https://www.woolworths.com.au/api/v3/ui/trolley/update`;
const requestBodyTemplate = {
    "items": [
        {
            "stockcode": 0,
            "quantity": 0,
            "source": "ww-sm:homepage.blt-buy again",
            "diagnostics": "0",
            "searchTerm": null,
            "evaluateRewardPoints": false,
            "offerId": null,
            "profileId": null,
            "priceLevel": null
        }
    ]
};

browser.runtime.onMessage.addListener((message) => {
    if (message.type === 'csvData') {
      const rows = message.data;

      (async () => {
        for (const [count, stockcode] of rows) {
            const quantity = parseInt(count);
            const stockcodeInt = parseInt(stockcode);
            if (isNaN(quantity) || isNaN(stockcodeInt)) {
                console.error(`Invalid data: ${count}, ${stockcode}`);
                continue;
            }
            const body = {
                ...requestBodyTemplate,
                items: [
                    {
                        ...requestBodyTemplate.items[0],
                        stockcode: stockcodeInt,
                        quantity: quantity
                    }
                ]
            };
          try {
            // Send the request with the body to the URL

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Accept-Language': 'en-AU',
                },
                body: JSON.stringify(body)
            });
            if (!res.ok) {
                console.error(`Error: ${res.status} - ${res.statusText}`);
                continue;
            }
            const data = await res.json();
            if (data.error) {
                console.error(`Error: ${data.error}`);
                continue;
            }

            console.log(`Sent: ${url} → Status: ${res.status}`);
          } catch (e) {
            console.error(`Failed: ${url}`, e);
          }

          await new Promise(res => setTimeout(res, 100));
        }

      })();
    }
  });
