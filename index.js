import express, { response } from "express"; // "type": "module"
import { Db, MongoClient, ObjectId } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

async function createConnection() {
  const client = new MongoClient(MONGO_URL); // dial number
  await client.connect(); // pressing call button
  console.log("Mongo is connected ✌😊");
  return client;
}

export const client = await createConnection();



app.get("/", function (request, response) {
  response.send("Welcome to Rental.in API where you can see the listed products for rent, or you can add your own listings,\n Endpoints: \n /getdata to get all the data; /postdata to post a listing from front end in add product; /updateproduct/:id where you can update the product with its object it; /contactus endpoint is used to send the contact us page data to the db");
});

app.get("/getdata", async function(request, response){
  const collections = await client.db("Webcode2_0").collection("products").find();
  response.send({collections})
})

app.post("/postdata", async function(request, response){
  const collections = await client.db("Webcode2_0").collection("products").insertMany(data);
  response.send({msg:"data uploaded", collections: collections})
})

app.post("/addproduct", async function(request, response){
  const productdata = request.body;
 try {
	 const product = await client.db("Webcode2_0").collection("products").insertOne(productdata)
	  response.status(200).send({msg:'product updated successfully', productdetails: product })
} catch (error) {
  response.status(400).send({msg:error})	
}
})

app.put("/updateproduct/:id", async function(request,response){
  const id = request.params.id;
  const update = request.body;
  try {
	const foundprod = client.db("Webcode2_0").collection("products").updateOne({_id:ObjectId(id)},{$set:update})
	  response.status(200).send({msg:'updated', updates: foundprod})
} catch (error) {
  response.status(400).send({msg:error})	
}
})

app.post("/contactus", async function(request, response){
  const productdata = request.body;
 try {
	 const product = await client.db("Webcode2_0").collection("messages").insertOne(productdata)
	  response.status(200).send({msg:'message updated successfully', productdetails: product })
} catch (error) {
  response.status(400).send({msg:error})	
}
})

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));

// const newdata = {
//   "category": [],
//   "img": "https://m.media-amazon.com/images/G/31/apparel/rcxgs/tile._CB483369979_.gif",
//   "issponsored": true,
//   "name": "Kurtzy Adjustable Knee/Shin and Elbow Guard Gear for Adults Bike Motocross Racing Motorcycle Sports with Hand Gloves - Black -biking ",
//   "rating": 4,
//   "peoplerated": 639,
//   "isdeal": true,
//   "mrp": 2999,
//   "discount": 50,
//   "deliverydate": "2022-11-30",
//   "available": false,
//   "quantity": 30
// }

// console.log(JSON.stringify(newdata))
