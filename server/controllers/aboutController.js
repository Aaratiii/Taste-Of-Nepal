require("../models/database");
const Response = require("../models/Response");

const renderAboutPage = (req, res) => {
  // You can fetch additional data from the database or other sources if needed
  const isLoggedIn = req.session.user ? true : false;
  res.render("about/aboutPage", { title: "About Us", isLoggedIn });
};



const LoadsubmitResponse=async(req,res)=>{
  try {
    const { name, email, message } = req.body;

    // Save the response to the database
    const newResponse = new Response({
      name,
      email,
      message,
    });

  const info =  await newResponse.save();
console.log(info)
    // Redirect or render a thank you page
    res.redirect('/thankYou'); // You can create a thankYou.ejs page

  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).send({ message: 'Error occurred while submitting response' });
  }
}



module.exports = {
  renderAboutPage,
  LoadsubmitResponse,
};

