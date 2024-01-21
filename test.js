const Indigo = require('./external/indigo-ketcher');
const fs = require('fs');
const path = require('path');

const inputFileName = path.resolve('examples', 'ketcher.mol');
const outputFileName = path.resolve('examples', 'ketcher.ket');


Indigo().then(indigoImplementation => {
    const options = new indigoImplementation.MapStringString();
    const initialData = fs.readFileSync(inputFileName);
    const resultingData = indigoImplementation.convert(initialData, 'ket', options);
    fs.writeFileSync(outputFileName, resultingData);
});

