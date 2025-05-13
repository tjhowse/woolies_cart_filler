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

// Translate the product_id to stockcode
const translateProductIdToStockcode = async (productId) => {
    const grocyURL = await browser.storage.local.get('grocyURL');
    const grocyAPIKey = await browser.storage.local.get('grocyAPIKey');

    if (!grocyURL || !grocyAPIKey) {
        console.error("Grocy URL or API key not set.");
        return;
    }
    const product_url = `${grocyURL.grocyURL}/api/objects/products?query%5B%5D=id%3D`;
    const headers = {
        'accept': 'application/json',
        'GROCY-API-KEY': grocyAPIKey.grocyAPIKey,
    };

    try {
        const response = await fetch(`${product_url}${productId}`, { headers });
        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            return;
        }
        const data = await response.json();
        if (data.error) {
            console.error(`Error: ${data.error}`);
            return;
        }
        const product = data[0];
        if (!product) {
            console.error(`No product found for ID: ${productId}`);
            return;
        }
        return product.userfields.stockcode;
    } catch (error) {
        console.error("Error fetching product:", error);
    }
}

// Poll grocy for the shopping list
const pollGrocy = async () => {
    const grocyURL = await browser.storage.local.get('grocyURL');
    const grocyAPIKey = await browser.storage.local.get('grocyAPIKey');

    if (!grocyURL || !grocyAPIKey) {
        console.error("Grocy URL or API key not set.");
        return;
    }
    const list_url = `${grocyURL.grocyURL}/api/objects/shopping_list`;
    const product_url = `${grocyURL.grocyURL}/api/objects/products?query%5B%5D=id%3D`;
    const headers = {
        'accept': 'application/json',
        'GROCY-API-KEY': grocyAPIKey.grocyAPIKey,
    };

    try {
        const response = await fetch(list_url, { headers });
        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            return;
        }
        const data = await response.json();
        if (data.error) {
            console.error(`Error: ${data.error}`);
            return;
        }
        const rows = await Promise.all(data.map(async (item) => {
            // Translate the product_id to stockcode
            const productId = item.product_id;
            const quantity = item.amount;
            const stockcode = await translateProductIdToStockcode(productId);

            return [quantity, stockcode];
        }));

        return rows;
    }
    catch (error) {
        console.error("Error fetching shopping list:", error);
    }
}

// Listen for messages from the popup
browser.runtime.onMessage.addListener((message) => {
    if (message.type === 'grocyPoll') {
        (async () => {
            const rows = await pollGrocy();
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
        // Refresh the page after filling the cart
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
});
