const fs = require('fs');
const path = require('path')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const COMPILED = './build/contracts/'
const EXPORTED = './go'
let files = fs.readdirSync(COMPILED);

function abiGen(abi, bin){
    const name = abi.split(".")[0]
    const command = `abigen --abi ${path.join(EXPORTED,abi)} --bin ${path.join(EXPORTED, bin)} --pkg token --type ${name} --out ${path.join(EXPORTED,name+'.go')}`
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
    let name_bin = fil.split('.')[0]+'.bin'
    fs.writeFileSync(path.join(EXPORTED,name_bin),JSON.stringify(compiledContract.bytecode));
    return [name_abi,name_bin]
}

if (!fs.existsSync(EXPORTED)){
    fs.mkdirSync(EXPORTED);
}
files = files.map(a => {return storeAbi(a)}).map(b => {console.log(b,b[0],b[1]);abiGen(b[0],b[1])})