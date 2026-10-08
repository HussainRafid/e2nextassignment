import multer from 'multer'
import {extname} from 'path'
import {randomUUID} from 'crypto'
const maxSize = 5 * 1024 * 1024
const storage = multer.diskStorage({ destination: 'uploads/',
  filename: (_req, file, cb) => {
    cb(null, randomUUID() + extname(file.originalname).toLowerCase())
  },
})

const upload = multer({ storage, limits: { fileSize: maxSize } })

module.exports = upload