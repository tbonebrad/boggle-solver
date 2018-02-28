let fs = require('fs');
let obj;
fs.readFile('dictionary.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    let goodData = {};
    let goodCount = 0;
    let badCount = 0;
    Object.getOwnPropertyNames(obj).forEach((word) => {
        let lowerCaseWord = word.toLowerCase();
        if(lowerCaseWord.indexOf(' ') == -1 && lowerCaseWord.indexOf('-') == -1){
            goodData[lowerCaseWord] = 1;
            goodCount++;
        } else {
            badCount++;
        }
    });

    console.log('kept ' + goodCount + ' words')
    console.log('removed ' + badCount + ' words')
    let content = JSON.stringify(goodData);
    fs.writeFile("dictionary_word_list.json", content, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
});