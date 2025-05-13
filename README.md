# Woolies Cart Filler

This is a firefox plugin that populates your shopping cart on [woolworths.com.au](https://www.woolworths.com.au)
from your shopping list from [Grocy](https://grocy.info/).

## Setup

You will need an existing Grocy installation with an API key configured.

Install this addon into your browser. It will add a toolbar icon. Click the button and populate the
Grocy URL and API key fields, then click "Save Grocy details".

### Grocy stockcode

You need to provide a link from your products in Grocy to the item on Woolworths' website. In Grocy,
create a custom product userfield named "stockcode". For each Grocy product, find the corresponding
product on Woolworths' website and determine the stockcode for that product.

This can be found by using browser network tools to view the details of the "update" POST request
sent to the server when clicking a button that adds a product to your cart. The body of the request
will look like this:

  {
    "items": [
      {
        "diagnostics": "4",
        "evaluateRewardPoints": false,
        "offerId": null,
        "priceLevel": null,
        "profileId": null,
        "quantity": 1,
        "searchTerm": null,
        "source": "ww-sm:homepage.blt-buy again",
        "stockcode": 142574
      }
    ]
  }

Take the number from the stockcode field and enter it into the userfield for the product in Grocy.

## Use

Populate your Grocy shopping list with products.

Navigate to https://www.woolworths.com.au and sign in. Click the toolbar icon and then "Populate cart".
The addon will query Grocy for products in your shopping list with the stockcode userfield populated,
and will add those products to your shopping cart. Check out as normal.

Note that items already in your cart will not be removed. Products without a stockcode in Grocy will
be ignored.