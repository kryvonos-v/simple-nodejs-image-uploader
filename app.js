const express = require('express')
const ejs = require('ejs')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: './public/uploads',
  filename (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const uploader = multer({
  storage,
  limits: {
    fileSize: 1000000 // Max file size is 1mb
  },
  fileFilter (req, file, callback) {
    if (isImageFileSupported(file)) {
      callback(null, true)
    } else {
      callback('Error: We only accept images of type png and jpeg')
    }
  }
}).single('image')

const app = express()
const PORT = 3000

app.set('view engine', 'ejs')
app.use(express.static('./public'))

app.get('/', (req, res) => res.render('index'))
app.post('/upload-image', (req, res) => {
  uploader(req, res, err => {
    res.render('index', {
      uploadingErrorMessage: err,
      uploadedImageSrc: '/uploads/' + req.file.filename
    })
  })
})

app.listen(PORT, () => console.log(`Application is running on port ${PORT}`))

function isImageFileSupported (file) {
  const supportedExtensions = /jpeg|jpg|png/
  return (
    supportedExtensions.test(path.extname(file.originalname).toLowerCase()) &&
    supportedExtensions.test(file.mimetype)
  )
}
