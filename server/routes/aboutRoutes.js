const express = require("express");
const multer = require("multer");


// Import your controllers or define the route logic here

router.get('/', aboutController.renderAboutPage);
router.post('/submitResponse', aboutController.LoadsubmitResponse);


// Example route to render the "About" page
router.get("/", (req, res) => {
  res.render("about/aboutPage", { title: "About Us" });
});

module.exports = router;



