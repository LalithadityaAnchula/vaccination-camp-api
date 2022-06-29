const City = require("../models/City");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const path = require("path");
const fs = require("fs");
const { PDFDocument, StandardFonts } = require("pdf-lib");

const certificatePath = path.join(__dirname + "/../public/template.pdf");
const certificateSavePath = path.join(__dirname + "/../public/certificate.pdf");

const generatePdfCertificate = async (name, dose) => {
  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(fs.readFileSync(certificatePath));

  // Embed the Helvetica font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Courier);

  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Get the width and height of the first page
  const { width, height } = firstPage.getSize();

  // Draw a string of text diagonally across the first page
  firstPage.drawText(name, {
    x: width / 4 + 100,
    y: height / 10 + 220,
    size: 30,
    font: helveticaFont,
  });

  firstPage.drawText(dose, {
    x: width / 4 + 150,
    y: height / 10 + 190,
    size: 20,
    font: helveticaFont,
  });

  // Write the PDF to a file
  fs.writeFileSync(certificateSavePath, await pdfDoc.save());
};

exports.getCertificate = asyncHandler(async (req, res, next) => {
  const userObject = req.user.toObject();
  console.log(userObject.secondDose);
  let doseType = "No Dose";
  if (userObject.firstDose === undefined && userObject.secondDose === undefined)
    return next(new ErrorResponse("You are not vaccinated", 400));
  if (req.params.doseType === "firstDose" && userObject.firstDose) {
    doseType = "First Dose";
  } else if (req.params.doseType === "secondDose" && userObject.secondDose) {
    doseType = "Second Dose";
  } else {
    return next(
      new ErrorResponse("You did meet conditions for this download", 400)
    );
  }

  await generatePdfCertificate(
    userObject.firstName + " " + userObject.lastName,
    doseType
  );

  res
    .status(200)
    .download(certificateSavePath, "certificate.pdf", function (err) {
      if (err) {
        // Handle error, but keep in mind the response may be partially-sent
        // so check res.headersSent
        if (res.headersSent) console.log("File partially sent");
        console.log(err);
      } else {
        // decrement a download credit, etc.
        console.log("Certificate sent successfully");
      }
    });
});
