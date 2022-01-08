const sharp = require('sharp');

exports.UploadSingleBase64 = async (req, res, next) => {
    if (req.body.coverpic) {
      if (req.body.coverpic[0].base64)
        req.body.coverpic = req.body.coverpic[0].base64;
      const filename = `Photo-${Date.now()}.jpeg`;
      const uri = req.body.coverpic.split(";base64,").pop();
      let imgBuffer = Buffer.from(uri, "base64");
  
      await sharp(imgBuffer)
        .jpeg({ quality: 97 })
        .toFormat("jpeg")
        .toFile(`public/uploads/${filename}`);
  
      req.body.coverpic = filename;
    }
    req.body.listOfImages = [];
  
    if (req.body.galary) {
      await Promise.all(
        req.body.galary.map(async (file, i) => {
          const filename = `Photos-${Date.now()}-${i + 1}.jpeg`;
          const uri = file.base64.split(";base64,").pop();
          let imgBuffer = Buffer.from(uri, "base64");
  
          await sharp(imgBuffer)
            .jpeg({ quality: 97 })
            .toFormat("jpeg")
            .toFile(`public/uploads/${filename}`);
  
          req.body.listOfImages.push(filename);
        })
      );
      req.body.galary = req.body.listOfImages;
    }
  
    req.body.newImgss = [];
  
    if (req.body.newImgs) {
      await Promise.all(
        req.body.newImgs.map(async (file, i) => {
          const filename = `Photos-${Date.now()}-${i + 1}.jpeg`;

          const uri = file.base64.split(";base64,").pop();
          let imgBuffer = Buffer.from(uri, "base64");
  
          await sharp(imgBuffer)
            .jpeg({ quality: 97 })
            .toFormat("jpeg")
            .jpeg()
            .toFile(`public/uploads/${filename}`);
  
          req.body.newImgss.push(filename);
        })
      );
      req.body.newImgs = req.body.newImgss;
    }
    next();
  };