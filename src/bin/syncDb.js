import koneksi from'../config/koneksi';
import path from 'path';
import fs from 'fs';
let normalizedPath = path.join(__dirname, "../modules");
// console.log(normalizedPath);
fs.readdirSync(normalizedPath).forEach(function (file) {
    let normalize = path.join(__dirname, "../modules/" + file);
    fs.readdirSync(normalize).forEach(function (file2) {
        if (file2 == "model.js") {
            import(`../modules/${file}/model.js`)
        }
    });
});

koneksi.sync({ alter: true }).then(() => {
    console.log('Database Berhasil di Sinkronisasi')
    console.log('disconnecting...')
    process.exit(0);
}).catch(e => {
    console.log(e)
});