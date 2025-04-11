import fs from 'fs';
import unzipper from 'unzipper';
const tempPath = 'temp';
// https://github.com/epam/ketcher/releases 
// use assets for ketcher-standalone-2.26.0.zip
const request = await fetch('https://github.com/epam/ketcher/releases/download/v2.26.0/ketcher-standalone-2.26.0.zip');
const zipFile = new Uint8Array(await request.arrayBuffer());
const archivePath = `${tempPath}/ketcher.zip`;
if (fs.existsSync(tempPath)) {
    fs.rmSync(tempPath, { recursive: true });
}
fs.mkdirSync(tempPath, { recursive: true });
fs.writeFileSync(archivePath, zipFile);

const directory = await unzipper.Open.file(archivePath);
await directory.extract({ path: tempPath });
if (!fs.existsSync('public/ketcher')) {
    fs.mkdirSync('public/ketcher');
}
// remove all from public/ketcher
fs.rmSync('public/ketcher', { recursive: true });
// copy all from tempPath/standalone to public/ketcher
fs.renameSync(`${tempPath}/standalone`, 'public/ketcher');
fs.writeFileSync('public/ketcher/.gitkeep', '');
fs.rmSync(tempPath, { recursive: true });