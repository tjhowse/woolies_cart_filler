#!/bin/bash
rm *.zip

version=$(jq -r '.version' manifest.json)

zip -r "woolies_cart_filler_$version.zip" * -x .git -x *.xcf -x *.sh -x *.zip *.md