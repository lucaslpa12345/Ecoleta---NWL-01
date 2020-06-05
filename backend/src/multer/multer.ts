import multer from 'multer'
import path from 'path'
import cripto from 'crypto'
import mime from 'mime'


export default { 
      storage: multer.diskStorage({ 
           destination: path.resolve(__dirname, '..' , 'uploads' ),
           filename(request, file , callback ) { 
             const hash = cripto.randomBytes(6).toString('hex')

             const filename = `${hash}-${file.fieldname}${path.extname(file.originalname)}`

             callback(null, filename)
           } 
      })
}