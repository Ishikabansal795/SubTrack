
const { cleanMerchant, detectRecurring } = require("./utils/detectRecurring");

const transactions = [
  { date: "2026-05-05", description: "NETFLIX.COM*MUMBAI 8821", amount: 649, type: "debit" },
  { date: "2026-06-05", description: "Netflix India", amount: 649, type: "debit" },
  { date: "2026-07-05", description: "NETFLIX.COM 1938", amount: 649, type: "debit" },

  { date: "2026-05-12", description: "UPI-SPOTIFY-9921", amount: 119, type: "debit" },
  { date: "2026-06-12", description: "Spotify Premium", amount: 119, type: "debit" },
  { date: "2026-07-12", description: "SPOTIFY INDIA", amount: 119, type: "debit" },

  { date: "2026-07-03", description: "SWIGGY ORDER 55123", amount: 342, type: "debit" }
];


console.log("Merchant cleaning test:");
console.log(cleanMerchant("NETFLIX.COM*MUMBAI 8821"));
console.log(cleanMerchant("Netflix India"));


console.log("\nDetected recurring payments:");
console.log(JSON.stringify(detectRecurring(transactions), null, 2));
