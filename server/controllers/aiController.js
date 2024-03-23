const tf = require("@tensorflow/tfjs-node");
const fs = require("fs/promises");
const path = require("path");
 
const UPLOAD_DIR = path.join(__dirname, "../../public/uploads/predict");
const MODAL_DIR = path.join(__dirname, "../efficient_net_finetune_tfjs");
 
const modelPath = `file://${MODAL_DIR}/model.json`;
const class_names = [
  "kheer",
  "sekuwa",
  "dalbhat",
  "gundruk",
  "dhindo",
  "chatamari",
  "momo",
  "chhoila",
  "selroti",
];
 
let recipeDatabase = {
  "chatamari": `<p>Chatamari has deep roots in the cultural and culinary traditions of Nepal, especially among the Newar people, who are the indigenous inhabitants of the Kathmandu Valley. The dish has been a part of Nepali cuisine for centuries, passed down through generations and evolving into various regional variations.
  Chatamari is a traditional dish from Nepal, particularly popular among the Newar community. It is often referred to as a "Nepali pizza" due to its round shape and diverse toppings. Here is a brief history and description of Chatamari</p>`,
  "chhoila": `<p>Chhoila is a traditional Newari dish originating from the Newar community in Nepal. The Newars are an indigenous ethnic group of the Kathmandu Valley known for their rich cultural heritage and distinct cuisine. Chhoila is a popular dish often served as an appetizer or snack during festivals, celebrations, and social gatherings.

  <br>The dish primarily consists of grilled or smoked meat, typically buffalo, chicken, or goat, which is marinated in a mixture of various spices and ingredients. The meat is first cooked and then shredded or diced into bite-sized pieces. The marinade usually includes ingredients such as mustard oil, garlic, ginger, green chili, salt, and a blend of traditional Nepali spices such as timur (Sichuan pepper), turmeric, cumin, and coriander.</p>`,
  "dalbhat": `<p>Dal Bhat, the quintessential Nepali dish, consisting of lentil soup (dal) served with rice (bhat), along with a variety of side dishes such as vegetable curries, pickles (achar), and sometimes meat or fish, holds immense cultural significance in Nepal. Its roots trace back to the cultural and agricultural heritage of the region, where lentils and rice have been staples for centuries. Lentils, rich in protein and nutrients, have been cultivated alongside rice, the primary carbohydrate source, reflecting Nepal's long history of agriculture. Over time, the simple combination of dal and bhat evolved into a cohesive meal, with different regions developing their own variations incorporating local ingredients and cooking techniques. This culinary evolution led to Dal Bhat becoming a symbol of Nepali identity, cherished for its nutritional value, cultural importance, and role in social and religious practices. Whether served as a gesture of hospitality to guests or enjoyed as a daily meal, Dal Bhat remains a beloved and integral part of Nepali cuisine, embodying the country's diverse culinary traditions.</p>`,

  "dhindo": `<p>Dhindo, a traditional Nepali food crafted from buckwheat, millet, or corn flour, epitomizes the fusion of agricultural practices and culinary traditions deeply embedded in Nepal's heritage. Originating from ancient times, when indigenous communities cultivated resilient grains in the country's diverse landscapes, dhindo emerged as a staple dish sustaining generations. Its preparation involves blending flour with water and cooking it until it achieves a dense, porridge-like texture. Dhindo's cultural significance transcends mere sustenance, intertwining with festivals, religious ceremonies, and communal gatherings, where it is savored alongside lentil soup, vegetable curries, and pickles. This humble dish, consumed by hand, embodies both simplicity and nutritional richness, offering carbohydrates, fiber, and essential nutrients. Dhindo's resilience mirrors that of the Nepali people, who ingeniously utilize local resources to create dishes that nourish both body and spirit. Despite the encroachment of modernization, dhindo remains an enduring emblem of Nepali cuisine, preserving the country's culinary legacy amidst changing times.</p>`,
  "gundruk": `<p>Gundruk is a traditional Nepali food with a rich history deeply intertwined with the country's agricultural practices and cultural heritage. Originating in ancient times, gundruk emerged as a method of preserving leafy green vegetables such as mustard greens, radish leaves, and cauliflower leaves. To create gundruk, these vegetables are harvested, chopped, and left to ferment for several days in a mixture of salt and spices. The fermentation process not only preserves the vegetables but also enhances their flavor and nutritional value.

  Gundruk holds significant cultural importance in Nepal and is a staple ingredient in many Nepali dishes. It is commonly used to add a tangy flavor and unique texture to soups, curries, and stir-fries. Additionally, gundruk is celebrated for its digestive properties and is often consumed as a side dish to aid digestion, particularly with heavy or rich meals.
  
  <br>The history of gundruk reflects the resourcefulness of Nepali communities in utilizing local ingredients and traditional preservation techniques to create nutritious and flavorful foods. Despite modernization and changing dietary habits, gundruk remains a cherished part of Nepali cuisine, serving as a symbol of cultural identity and culinary heritage passed down through generations.</p>`,
  "kheer": `<p>Kheer, a beloved Nepali dessert, holds a significant place in the country's culinary history and cultural traditions. Originating from ancient times, kheer has its roots in Indian and Persian cuisines, reflecting the cultural exchanges and influences that have shaped Nepali gastronomy over the centuries. This creamy rice pudding is prepared by simmering rice in milk and sweetening it with sugar, flavored with aromatic spices such as cardamom, cinnamon, and cloves. Variations of kheer may include ingredients like nuts, dried fruits, saffron, or rose water, adding layers of texture and fragrance to the dish.

  Kheer is not only a delicious treat but also holds symbolic importance in Nepali culture, often served during festivals, celebrations, and religious ceremonies. It is a dish of abundance and prosperity, symbolizing good fortune and auspicious beginnings. Families gather to prepare kheer together, infusing the dessert with love and shared memories.
  
  The history of kheer in Nepal reflects the country's diverse culinary landscape and the blending of cultural influences from neighboring regions. Despite its ancient origins, kheer remains a timeless favorite, cherished by Nepalis of all ages. It continues to be a comforting indulgence, connecting people across generations and reaffirming the enduring legacy of Nepali cuisine.</p>`,
  
  
  "momo": `<p>Momo, a ubiquitous Nepali delicacy, boasts a rich history intertwined with cultural exchanges and culinary evolution. Originating from Tibet, momo made its way to Nepal through trade and migration routes, becoming an integral part of the country's gastronomic landscape. These dumplings are typically filled with a mixture of minced meat (such as buffalo, chicken, or pork), vegetables, and spices, wrapped in dough and then steamed or fried to perfection.

  <br>The history of momo in Nepal reflects the country's diverse cultural influences and culinary creativity. Over time, Nepali chefs have put their own spin on the traditional Tibetan recipe, incorporating local ingredients and flavors to create unique variations. Momo has evolved into a versatile dish, with countless regional and seasonal variations found across Nepal.
  
  Beyond its culinary appeal, momo holds deep cultural significance in Nepali society. It is a beloved comfort food enjoyed by people of all ages and backgrounds, from street vendors to upscale restaurants. Momo-making is often a communal activity, bringing families and friends together to bond over shared memories and delicious food.</p>`,
  
  "sekuwa": `<p>Sekuwa, a popular Nepali grilled meat dish, carries a history steeped in tradition and culinary innovation. Originating from the indigenous communities of Nepal, sekuwa has been a part of the country's culinary heritage for generations. The dish traditionally consists of marinated pieces of meat, such as buffalo, chicken, goat, or pork, skewered and grilled over an open flame or charcoal fire.

  The history of sekuwa is closely tied to Nepali cultural practices, particularly those related to communal gatherings and celebrations. It is often prepared during festivals, weddings, and other special occasions, serving as a centerpiece of festive feasts and social gatherings. Sekuwa-making is a skilled art passed down through families and communities, with each cook adding their own unique blend of spices and marinades to enhance the flavor of the meat.
  
  While sekuwa has deep roots in Nepali tradition, it has also evolved over time, adapting to changing tastes and culinary influences. Modern variations of sekuwa may incorporate new ingredients or cooking techniques, reflecting the dynamic nature of Nepali cuisine. Despite these changes, sekuwa remains a beloved dish cherished for its smoky flavor, tender texture, and ability to bring people together in celebration of food and community.</p>`,
 
  "selroti": `<p>Selroti, a traditional Nepali delicacy, holds a special place in the country's culinary heritage, with a history that dates back centuries. Originating from the Newar community of the Kathmandu Valley, selroti is a sweet, ring-shaped rice flour bread that is deep-fried to perfection. Its distinctive flavor and aroma make it a favorite snack or accompaniment to various Nepali dishes and festivities.
<br>The history of selroti is deeply intertwined with Nepali culture and tradition, particularly within the Newar community, where it is a staple offering during festivals, religious ceremonies, and family gatherings. Traditionally prepared by women in Newar households, selroti-making is considered an art form passed down through generations, with each family preserving its own unique recipe and techniques.

<br>The ingredients for selroti are simple yet essential: rice flour, sugar, ghee (clarified butter), yogurt, and sometimes spices such as cardamom or cloves for added flavor. The batter is carefully mixed to achieve the right consistency before being shaped into rings and deep-fried until golden brown. The result is a crispy exterior with a soft, fluffy interior, bursting with the sweet aroma of freshly fried bread.

<br>Selroti's significance extends beyond its culinary appeal; it symbolizes abundance, prosperity, and good fortune in Nepali culture. It is often offered as a token of hospitality to guests or as a religious offering during ceremonies and rituals. Selroti's popularity has transcended cultural boundaries, becoming a beloved treat enjoyed by people of all backgrounds throughout Nepal and beyond.


  </p>`,
};
 
/** @type tf.GraphModel | undefined */
let model;
 
async function loadModel() {
  if (model) return model;
  try {
    model = await tf.loadGraphModel(modelPath);
    return model;
  } catch (error) {
    console.error("Error loading the model", error);
    throw error;
  }
}
 
const predict = async (req, res) => {
  if (!req.file) return res.status(400).send("No image uploaded.");
  try {
    const model = await loadModel();
    if (!model) res.status(500).send("Model not found");
 
    // Read the image file
    const imagePath = path.join(UPLOAD_DIR, req.file.filename);
    const imageBuffer = await fs.readFile(imagePath);
 
    const result = tf.tidy(() => {
      // Decode the image to a tensor
      const imageTensor = tf.node.decodeImage(imageBuffer, 3);
      // Process the image tensor to match the input requirements of the model
      // Since the model includes a resizing layer, we don't need to resize it manually here
      const processedImage = imageTensor.toFloat().expandDims();
 
      // Get the prediction from the model
      const prediction = model.predict(processedImage);

// Convert the prediction to probability scores
const probabilities = prediction.dataSync(); // Use softmax if your model's final layer is logits
// Find the highest probability and its index
const predictedIndex = prediction.argMax(1).dataSync()[0];
const highestProbability = probabilities[predictedIndex];



const predictedClassName = class_names[predictedIndex];
console.log(highestProbability, predictedClassName )

if(highestProbability<0.7)
return "This image cannot be classified!";

      return predictedClassName;
    });
 
    // Get the recipe name based on the predicted class name
    const recipeName = recipeDatabase[result];
 
    res.status(200).send({ prediction: result, recipe: recipeName });
  } catch (error) {
    console.error("Error during prediction:", error);
    res.status(500).send({ message: "Error making prediction" });
  }
};
 
const home = (req, res) => {
  const isLoggedIn = req.session.user ? true : false;
  res.render("ai/home", { title: "Nepali Cuisine", isLoggedIn });
};
 
module.exports = {
  predict,
  home,
};