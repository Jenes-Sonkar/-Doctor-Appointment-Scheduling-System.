import multer from "multer";

const storage = multer.diskStorage({ // configure multer to use disk storage
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) { // configure the file name
      
      cb(null, file.originalname)
    } // set the file name as it was uploaded
  })//
  
export const upload = multer({ 
    storage, 
})