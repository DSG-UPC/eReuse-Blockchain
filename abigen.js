const fs = require('fs');
const path = require('path')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const COMPILED = './build/contracts/'
const EXPORTED = './go'
let files = fs.readdirSync(COMPILED);

function abiGen(fil){
    const name = fil.split(".")[0]
    const command = `abigen --abi ${path.join(EXPORTED,fil)} --pkg main --type ${name} --out ${path.join(EXPORTED,fil+'.go')}`
    exec(command)
    .then( result => {
        if (result.stdout != '') console.log(result.stdout)
        if (result.stderr != '') console.error(result.stderr)
    })
}

function storeAbi(fil){
    let compiledContract = JSON.parse(fs.readFileSync(path.join(COMPILED,fil)));
    let name_abi = fil.split('.')[0]+'.abi'
    fs.writeFileSync(path.join(EXPORTED,name_abi),JSON.stringify(compiledContract.abi));
    return name_abi
}

if (!fs.existsSync(EXPORTED)){
    fs.mkdirSync(EXPORTED);
}
files = files.map(a => {return storeAbi(a)}).map(b => {abiGen(b)})