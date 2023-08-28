import { finished } from'stream/promises';
import fs from'fs';
import { getMimeType } from 'stream-mime-type';
let MaxImageFileSize = 20000;
export default function saveFile(file) {
    console.log(file);
    return new Promise(async (ya,tidak)=>{
        let validation = true;
        let pesan =''
        const { createReadStream, filename, mimetype, encoding } = file;
     

        // if (mimetype === 'application/pdf' || mimetype === 'image/jpeg' || mimetype === 'image/jpg' || mimetype === 'image/png') {
         
        //   }else{
        //     validation = false;
        //     pesan='Tipe file tidak didukung';
        //   }


          if(validation){
            const streamA = createReadStream();
            let {stream, mime} = await getMimeType( streamA )
       
                if (mime === 'application/pdf' || mime === 'image/jpeg' || mime === 'image/jpg' || mime === 'image/png' || mime === 'application/octet-stream' || mime==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                    const out = fs.createWriteStream('./assets/local-file-output.jpeg');
                    let byteLength = 0;
                    stream.pipe(out).on("data", (data) => {
                        byteLength += data.byteLength;
                        console.log(byteLength);
                        // Once file size gets too big, kill all streams and halt the upload
                        if (byteLength > MaxImageFileSize) {
                            stream.destroy();
                            pesan = "file kebesaran";
                            tidak({pesan})
                        }
                      });
                      await finished(out);
          }else{
              validation = false;
            pesan='Tipe file tidak didukung';
            tidak({pesan})
          }
           
          
        
          
            ya({ filename, mimetype})
          }else{
            tidak({pesan})
          }

     
    })
    }