const fs = require('fs');
const pdf = require('pdf-parse');
let dataBuffer = fs.readFileSync('public/CV Muhammad Akmal Iskandar.pdf');
pdf(dataBuffer).then(function(data) {
    console.log("PDF_TEXT_START");
    console.log(data.text);
    console.log("PDF_TEXT_END");
}).catch(function(error) {
    console.log("ERROR:", error);
});
