module.exports.saveFilePath = async (req, res) => {
  try {
    const files = req.files;
    const fileDataArray = [];

    // Loop through each file type and extract fieldname and path
    Object.keys(files).forEach((fileType) => {
      const file = files[fileType][0]; // Assuming only one file per type

      const fileData = {
        fieldname: file.fieldname,
        path: file.path,
      };

      fileDataArray.push(fileData);
    });
    res.status(200).json({
      message: "Successfully fetched file paths",
      data: fileDataArray,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching file paths",
      error: error.message,
    });
  }
};

module.exports.savePdfFilePath = async (req, res) => {
  try {
    if (!req?.file?.path) {
      return res.status(200).send({
        success: false,
        message: "File not attached",
      });
    }
    const filePath = req.file.path;
    // Return the PDF file path
    res.status(200).json({ success: true, pdfFilePath: filePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to save PDF file path",
      error,
    });
  }
};
