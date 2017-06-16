console.log('Updating config file version');
const ROOT_DIR = (__dirname.slice(0,-6));
const FILE_PATH = ROOT_DIR + 'config/sssp_config.xml';
const fs = require('fs');

const configFile = fs.readFileSync(FILE_PATH, 'utf8');
const NUMBER_PATTERN = /<ver>(.*?)<\/ver>/i;
const OLD_VERSION = parseInt(configFile.match(NUMBER_PATTERN)[1]);
console.log('Old file version:' + OLD_VERSION);

const NEW_FILE = configFile.replace(NUMBER_PATTERN, '<ver>' + (OLD_VERSION + 1) + '</ver>');

fs.writeFile(FILE_PATH, NEW_FILE, function(err) {
      if(err) {
                return console.log(err);
            }

      console.log("The file was saved!");
}); 
