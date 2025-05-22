#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'client/src/components/SubscriptionWidget.tsx');

// Read the file
let fileContent = fs.readFileSync(filePath, 'utf8');

// First replacement (line 179)
fileContent = fileContent.replace(
  `                stripePriceId: \`price_\${plan.name.toLowerCase()}\``,
  `                stripePriceId: plan.name === "Basic" ? "price_1RRcnlGxl1XxufT4i2vJmX0m" : 
                  plan.name === "Standard" ? "price_1RRcoYGxl1XxufT4KFZbeJsn" : 
                  "price_1RRcp8Gxl1XxufT4oYuK4HG5"`
);

// Second replacement (line 190) 
fileContent = fileContent.replace(
  `                stripePriceId: \`price_\${plan.name.toLowerCase()}\``,
  `                stripePriceId: plan.name === "Basic" ? "price_1RRcnlGxl1XxufT4i2vJmX0m" : 
                  plan.name === "Standard" ? "price_1RRcoYGxl1XxufT4KFZbeJsn" : 
                  "price_1RRcp8Gxl1XxufT4oYuK4HG5"`
);

// Write back to the file
fs.writeFileSync(filePath, fileContent);

console.log('SubscriptionWidget.tsx updated successfully with the real Price IDs!');