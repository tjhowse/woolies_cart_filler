# Woolies Cart Filler

This is a firefox plugin that populates your shopping cart on https://www.woolworths.com.au with items
defined by a <count>,<stockcode> CSV document pasted into the popup window.

It is designed to harmonise with the grocery management tool [Grocy](https://grocy.info/).

## Setup

You will need an existing Grocy installation with an API key configured.

Install this addon into your browser. It will add a toolbar icon. Click the button and populate the
Grocy URL and API key fields, then click "Save Grocy details".

### Grocy stockcode

You will need to create a custom product userfield in Grocy named "stockcode". You must then populate
this field with the stockcode of each product on Woolworth's website. This can be found by using
browser network tools to view the details of the "update" POST request sent to the server when clicking
a button that adds a product to your cart. The body of the request will look like this:

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

Note that items already in your cart will not be removed.