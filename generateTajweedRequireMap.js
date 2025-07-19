const fs = require('fs');
const path = require('path');

const tajweedDir = path.join(__dirname, 'android/app/src/main/assets/tajweed');
const files = fs.readdirSync(tajweedDir);

let output = 'const tajweedFiles = {\n';

files.forEach(file => {
    const match = file.match(/surah_(\d+)\.json/);
    if (match) {
      const surahNum = match[1];
      output += `  '${parseInt(surahNum, 10)}': require('../../android/app/src/main/assets/tajweed/surah_${parseInt(surahNum, 10)}.json'),\n`;
    }
  });

output += '};\n\nexport default tajweedFiles;\n';

fs.writeFileSync(path.join(__dirname, 'tajweedRequireMap.js'), output);
console.log('tajweedRequireMap.js generated!');