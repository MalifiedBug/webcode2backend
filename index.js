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

const data = [
  {
    id: "1",
    category: ["biking", "sporting"],
    img: "https://m.media-amazon.com/images/I/71VIaHcRkqL._AC_UL480_QL65_.jpg",
    issponsored: false,
    name: "BIKING BROTHERHOOD Unisex Xplorer Jacket, Grey, 2XL",
    rating: 4,
    peoplerated: 44,
    isdeal: true,
    mrp: 23456,
    discount: 9,
    deliverydate: "2022-11-16",
    available: true,
    quantity: 456,
  },
  {
    id: "2",
    category: ["biking", "sporting"],
    img: "https://m.media-amazon.com/images/I/51qGK60iOsL._UX522_.jpg",
    issponsored: true,
    name: "LOCALLION Cycling Backpack Biking",
    rating: 0,
    peoplerated: 0,
    isdeal: false,
    mrp: 5440,
    discount: 46,
    deliverydate: "2022-11-16",
    available: true,
    quantity: 4,
  },
  {
    id: "3",
    category: ["trekking", "biking", "sporting"],
    img: "https://m.media-amazon.com/images/I/51bz0Uq7RxL._SY450_.jpg",
    issponsored: false,
    name: "Lista Adult Bike Helmet with Rechargeable USB Light, Bicycle Helmet for Men Women Road Cycling & Mountain Biking with Detachable Visor Large Size (Black)",
    rating: 5,
    peoplerated: 16,
    isdeal: false,
    mrp: 2400,
    discount: 40,
    deliverydate: "2022-11-30",
    available: true,
    quantity: 4,
  },
  {
    id: "4",
    category: [],
    img: "https://m.media-amazon.com/images/I/21Old05VqjL.jpg",
    issponsored: false,
    name: "BIKING BROTHERHOOD Balaclava",
    rating: 3,
    peoplerated: 7,
    isdeal: true,
    mrp: 350,
    discount: 0,
    deliverydate: "2022-11-23",
    available: true,
    quantity: 7,
  },
  {
    id: "5",
    category: ["trekking"],
    img: "https://m.media-amazon.com/images/I/714tMnn24XL._SX425_.jpg",
    issponsored: false,
    name: "Coleman Sundome Camping Green Tents",
    rating: 5,
    peoplerated: 5894,
    isdeal: true,
    mrp: 10877,
    discount: 16,
    deliverydate: "2022-12-14",
    available: true,
    quantity: 9,
  },
  {
    id: "6",
    category: ["trekking"],
    img: "https://m.media-amazon.com/images/I/61DClEkeKvL._SX425_.jpg",
    issponsored: true,
    name: "1PC Camping Light Bulb Portable LED Camping Lantern Camp Tent Lights Lamp Camping Gear and Equipment with Clip ok for Indoor and Outdoor Hiking Backpacking Fishing Outage Emergency",
    rating: 0,
    peoplerated: 0,
    isdeal: false,
    mrp: 2450,
    discount: 40,
    deliverydate: "2022-11-24",
    available: true,
    quantity: 99,
  },
  {
    id: "7",
    category: ["trekking"],
    img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBYUFRgUFRUVGBUYGBgeHRkcGhgaGBgYHxgZHBofGRofIS4lHB4rHxgaJjgmODMxNTU1HSQ+QDs0Py40NzEBDAwMEA8QHxISHzQrJCs0NDQ0NDQ0NjQ0NDQ0NDQ0NDU0NDQxNDQ0ND40NDQ0PzQ0NDQ1NDQ0NDQ0NDQ0NDQ9Mf/AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABQYCAwQBB//EADoQAAIBAgQDBgUCBQQCAwAAAAECAAMRBBIhMQVBUQYiYXGBkRMyQqGxYsEUUpLR8COC4fEHchUzQ//EABoBAQEBAQEBAQAAAAAAAAAAAAABAgQDBQb/xAAoEQEBAAIBAwMDBAMAAAAAAAAAAQIRAyExQQQSEwVRYTJxgdEiocH/2gAMAwEAAhEDEQA/APs0REBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERATQ9dQwUnvEE28BYXPQXImVSoFFyQBpqfE2H3MjzTZ6mbMwXMvd2uFz7+Ze9v0jrAlYiICIiAiIgIiICIiAiIgIiYO4G5A8zaBnERAREQEREBERAREQEREBESOxdQs3wl6DOb2IQhhYc8xI9oGmpUFRsx/wDrQmwP1MLHMOoFjbyJmzg6EqajXu7FrHkpAyj0UL63nPjKX+phlA2Z2t0UUmX8uo9ZMILACWjOIiQIiICIiAiIgIiICIiAkfjEu3eBKkW5fvJCYOgIsReBH0KzIAtgVG24IH7za/EFFu62p1028fGY4nDsBdSfYEj05iag6sCCMreF8reXSUd1PEKxIDC67jYjpvN8iRhswJAG9j1mK/ESwBNl+k8xGhMRI1OIEA5lOm2XW49951U8UjWAYXYXA5kc9I0OiIiQIiICIiAlVrVS2CNQDKxZSbXuT/EANc76gG/nLHiKwRSx2A/6A6kmV3EYc08AyN8wUEjozVM2XxsWt6SwS2EplqruwsFsiD9I1J9WJ9FEk5qojQnqZtkoREQEREBERAREQEREBERAREQE5q+GDajQ/YzpiBF06xpkgqbHU9RyuBzE6cQwZQVIIuNR/njN9SmGFj/yPKRr0srEai/s3jbrKNuFohlN7ghiL/cfmcXEaWTvX1UXvtpufxJHhx+cfqv7gf2mPEMPm5XBFjz6/wB48o74kKOJOrKrWKsyrcCxuxAH3MmpFImp6qruwHmZpbGLyBbyGnudIHXEiq3ESGVAFDvmyqSMzZRdrDQGw8eciuJYjHG4p0EIA51AOo+QDwP1cpdCQ7SYjJTQhrH4+HBsdSGrIpHlrNuIqq1gxUKpBNyBmYG6jXkDY+dp854r/HWVqwVUV6bFAhJOWqh+azWsVvqw2Myx3Eaj1cq1UUIpezZTcjRR3gV3N9fO4tLInnT6smwmcpHZLjTMlnUqQSrpr3WuRmT9JI25EEdDLqpv5SWKyiIkCIiAiIgIiICIiAiIgIiICIiAmqrTDCx/6M2xAiajNTJNwvUn5SBzmn/55B8xW3W5Akf2+wL16KoutmzWuRdgO6Lj1lKrcJZsOKiuxdEBZS+gFxmLljZLLyuNQd5rp5TV8LBxvjiAB1a+Soj6WOiuG525Cc9XtXiqwP8AD4d3H85LZPdcqj+qUeljAxXKwJDLsb8+k+o4vgoIZqj1KpVWIBY2JAJsANprok2juDYLF12z4qt8NNLJTKjMbE2eohvbwDE+I52dMSlEKhA+JrZEGYsAR3rch3hcnrvzkLh6rrg3ZMzu4cIjBCmhKIAVCgCwDXPI+GnZwPhQwyMzuTUqE1HZmuAxAzBeQQZRt0v5Ytb0YstXr0WXIlTDsXKF8z5XR0syroAb33OqzrArjOwam7sy2HeQBVbNl573bXxnRh66uiujKyMAVYG4KnYg9JtBkNK12o4lUOTD0708RVcIrMQqBbZnZH+o7DTUche19GJ7OKozuuf4aXbXuO5AUME5HKBd7AXN7bkTuK4VRekKGRVTXKFsCjG92Q/S2pN/Ga+C06lKm9Cpdlp91G0u9JUAUswOh0IIIvfqJdppXcZgWolK6HUd3KzAZ1Nrq17XIsPGw6qL2nhPEAUB7xUi45t5dD++43kPw/FPVoKgzAktmJ1YZXIAvbUnLqf7zkFKph6jKCURzmBFrH5b5QQQO9nJFvrl1s7LRicSKgAsR811Ppbz3mtax0s7WG2osP7+t5wYeqT3mYHQ/SF3sTe2nIdJP4BQaSX17i7/APqI7J3cy4twbkg/ptlHvqZkuPYDvLc8spH3zEe/2mGOAVgAAO6Sbec24XDBkUkm5APLnHQZjHrYXDBj9IBa3qNLTcMQpIAZbnYXFz6TlqYSwJzXAE50QkkAXO5taTQmYkVnqr9Rt+pbgeot+TMHxdQ2GguQO7cE30G+0aVMRI3DVmRgjkm+xJv5a9JJSBERAREQEREBERA48bRzDw2P7HzBtKL2jwlRScrt8JyVenoafxAc2bLbTMLNpzB6z6IZAcZwwdGIF7HUeKm6n7W8jNSrrcfJqnDRSIq0hkdSCHW4IN+U+p8UxNmFINlJUuxG4QELpbYsxtfoGtraU7jtFS5RBYEobchcKSbnkNTfpLRjamZy4AN0UWygsLd62vO9vKxmqz2RZdMIrqwX4Zqd4k3UJooDZRbKBZddAqC55yQxnaGnWw/+iD/EfQjXDAjdrn5ksD3r2OnUTlquECOvfVg3gCLFbDTx3nz/ALQ41EdSjrdy3xKa91Kbhu4ShVkN0ynMUY769M3HyS+Ft7OdtK+IcUVwwdzuyuUAHMtcNbx1lu4vQxJpkpQw7spDKrVHsWXUEdwXPQXHnPjtLtM1JgVbIQb3RAysbblqdamrf0zvPblmLFnqPmGqHOqHyBxDKv8ASYsiza5cF7R1KbVWx7AOURkRVYKAbXRBY3a7rpq1xY7ATHFcVqY0mlTQopylnY3+EQ18pt3C4sO5qb/PYDK9KXtS1V0Sq7Lh0AzFWDsqW+RO6qMeWoYeZkt2H7Rg1GR+6hJKfoXMSFJ52Bt6RoXvBUFolMgstghFydu6pudSbgC+5DDoJF9qMaLUWVgQWq7G40ybHnJPO1RkNO2Q1FLNbTIpLm3iSqjzv0lB44r06r020QVarINsocoSB4aA+pid0y7LFhOL5CgdP9JwQKlu6rhrZXb6QQV3t16y94DEqygCwIFrdLabT5Dw/GldAbN1GksHD+NPbMj6iw1sw9yL/eWzaS9Fz4o3fsN8o/LTZh8egVV75YKoICNvbra33kDh+IvVOZwAwsNBYaE/fWTWHwzNyyr1Pzf0/wB/aZsVnVxpYZQjC/Niu3PQEmaQzrcoVDG3zKWFvIMJILg1G9z5k/tNq0VGwHtGxFlqjf8A6MfBFUD8Fh7z0YZjsp/H5kxEbVGYbAEMGY7G+5JJ5ankJJxEgREQEREBERATwmezEmAvIh6wV2DfKb/i+njJF6oXcgSt8SxF3JH1ABR9WujEjlcCw8CZdbaxsku2hX1zqCHZAtgLGxYlRrrextytcideAp2exsbqbjkeVv8AmMBTDUiw+Ykg9QBa1jy119ZzcNxqtUDlrAK4JIt3lJBsPMH2mmUZiK9N8nwWR6OZ1yi61KdQhn769LqdfzPlHazCsmJq6G111toRkSfTKvD6dJnZF77u7XNropLZVFtrBiPU+MovFeKOarg5WUGwuL6AAc7jl0l10Z31U8qeYHppNiD9I9bmWvD8UwxP+rgUfyqOhP8ASLD2kpg8fhn0w/B0dvGpVqAeYC29zJYbUzh9F65squTfQWt7CXTgvCaeHPxMTUCEa5Rcu36UTct4m1unOSdOtjao+GgwuFXmmHp56luYITOefPLNR7M0qZzYmr3utaotO+30JnqHnzXaWRX0DszxBcRRzouRFcoq3ucoCm58TfWVv/yDnFkQqA6nObKSCLZbX2PlrMuH4mhlFNMR3FJsqWpIL2BOdy7nx1E6RxHBUTmzIX6qGqvt/O2Yj3EzuY9a9MeLPPpjjb+yvdk+A1kYVaiLUCkMlyyZXU3BJAKsNtLjb3sb9n/iVPi4hhcnuUqGZATfXO19dfTnOLG9r1sSlNmI2LkAfYkmTnYTiD4hHqVCCwawsLBRYaCY+XG5and05eg5uPivLnNSa/nafwHD6dMAhFDnc7m531M7zIytxqgoJ+IrWvopBNxy05yHxHa3klP1Y/sP7zGfNhj3ry4/S82f6cf+LXAla4L2iNVslQKCdiL2v0O8ssuHJjnNxjl4suLL25Tq9iIm3mREQEREBERAREQPDI/ivEEoozubKqlj5Dew5yQMh+OYA1UIHhcdQGDftKIJca5OR3VnHecDYBiSot0AHraR+IpuSHLhSGB0N2y8xtYXHt6TsxGHdCzLSYu1r8r20FyeQ195D4jAYmqe9ZF6LqfVv+pbprGXw6KHFHQFUFyTfQFjby2mNTiQVS9++mpU6NtbQTZgOHGkbNqes84zj2pMpChha+uhv4N10G4O0x8sneO2+hucnx3d15Q+Pw+JrBWpLVVag1DUnUpbNsfrzd0crWO957hew10X4pqXG5sqM3jdyAPv6mdVLtdYWyVL9c63Ot7Hu+k04/to4XuUEub953LH2AH5j58PuzPpvqLf0/7dNHsnQpgtlQW3JU1393y01PkhkRxbtHSo3RKXxGF7fGqFk8LUlyoN/wCWQnEuO4mvo9Qqv8idxftqfUmQGMDLYItyedr6D7azPzy3UdF+l5YY+7kv8TrUtxDtTi6qlVqMia2SmBTXwFkAkRQpuxLMACbc7n1knwvA1K5CUkLNbvAWyqdL5m6C8vPBexqizVAHPmQnPbm3+bTFyzvRv4/ScNmVtt+39vnNPFKKy0iWJuNb6A72t+8stNbsFUFmY2CqCzMbE2CjU6AnyBn0ZOAUgLZEH/oiIPwT95pHBfh10q0FCsA4ZyVJUEbKhU3JIW+3n1mXFvy1w/U/ZLPbO/TxJPy+cVsQCpA1O/tLp2N4kmHwrFywNZ2CgC5JC2/ac1HsqQzlq1NVVu81jmN9bsDZVvrztoZJ4ng9P+HLUw1YUjdTe5U6AlVXKug156Cc892Ntk6x3eq9Xw82Ewl6Wzev7qtYCm1NwrHusbX8eUmzSQfqI/z0kTxQMrLmBDHKwBBGl9xfle8klUk6ak25Ti89nTy3cmW+/wBm2lWysCuljfTkR4z6PRe6g9QD7iUnAcAq1CCRkXqfmt4Df8S7U1sAByAHtO/0mOU3bOj4H1DkwzsmN3Z3bYiJ2vmkREBERAREQEREDwzBhMzMTLBzug6TmelO1hNFQSrENj6GlxuNfTnKj2j1ynwl7rCUntRTy5emtpz806bfZ+mZ/wCcxqq5ZhiEutptMwJnI/RxXP4ljVKhDkBILa6EDXwtym0U3dgiC7NoPzc9ABqT0El69MHS37Swdg+HZXeoD3muoawOVABmt0ZmZQD0Rp7YyZXpHzfU55cPHlcru29PxvwsPZnga0KSplAIvnb+djYa+AAIt4m+t5OVCxFkyr+oi4HkNLzF3ChFOmY5VA5mxNh6An0MiO01HG1QlDAstNmN2qNcZF6KbGzfe206o/MWp2gCoszZz1ICn0tpPWI/z/PGRGA4c/wlpVqjuVcFmuczhXva972Nh+Jox3aLDULZiEVmYKANCFOUmw0UXBA5G1+cI5e0SK1egrGyuxRjoSLkFD5g39z1l34fhlpU1RPlA0PM+JPMmfKBxL+LxVMr8ocuL/yqO7f2b3n0jhmIKKFc6cieXgT08ZNTe2rllcfbvpvenTxXg1LEZfiAkqdCDY25i/Qzrw2ERAAqqLdBr77zA1iOVx950UnBFxtHsx3vXVLnncZjbdTw3CezwT2aeZERAREQEREBERAREQPDMTPZ4ZYMDMHWbDMSJRxVUkLxjhq1kytcHkRuD+48JYnSRHGsUKFJ6xt3FJF+bfSP6rTOWPumntx8mWF92N6x8lxFdFrPQzBnR2SwBOYg27uk6MDhmrZ8mU5MufUDLmvbffY7XnL2YwzPUq4hgSaatlPWo5sDrzGZm/2y48B4Nlp57d59f9o+X9z6ieN4MY+rx/Vua49ZP3V88LP1N7f3MtXZKgEpvbm9td7BQR92aY1uGk8p7SqHDoWIOQG7W3GgF/IW18/CMMPbXj6v1GXNj1qxLbcbi/3mhnVgylrg6MoO/gbSIw/aCkwuSy77ggb8uu17+Mxq9qqIOVMzt+kHeer5uklj1dkKIcgIIz7MfBOYvtm5crnUfI1wNbGYr4VgCDlAGqIi6E3GmRR7+s+hYxcTiFNwaSW2PzsPBdx62nX2K4K9JmZqaqjWsxPfIGwAtqCTcnS9huNmyxwHs4uBR69Mu7ZFChrAgAgtt1sLdPGeYDjDnUPmv9FQqreS1AAjeRC+Zl/xGFDqVIuDK6/ZdAT3CVP8psR6bGXWjcdPCOOI7CjUulQ/KrixbfQcm8CLgiTuHp5WP8pH3/z8SApdnEsF/wBQqCDlYgqCDcEAjukHmLHxlmo07AXNzbeSJa2iexErJERAREQEREBERATwz2eQPIMRKMTMTNlpiwgUvtx2sbCLkoqrVbAsWuVQHbQbsenLTfaUXH8Yr1MMFruzms5fW2VKad0DKAAMz5+X0CSvaeg74utTK3dnXKvNw4GSx6XFv9pkPUpitiUw6G6JkRT1C2W58CbsfMzWM3W7ZMdeakcG64elSpZTeopqudAUSxC306B9P1DrL9wPGUcTSWpSPd+UqRZkYbqw5Hb0tKJxenmLvye1r/TQSy0welwAx/2yR/8AF9Fg2JYX+GcgHQuM97ehH2i1Zjl7d+F2qURI7EUPCT3w7zBsNflMpjlpS24Kl+6GS/JTZf6Z2YTg9vrf0sPxLOuEE3JhwJn2tXOOHDYawAtO9EmxUmQE1Hna8AmQWexCAEynl57IEREBERAREQEREBERAREQE8tPYgeGeTKIENxXgqVmFQALWVHVHtfLmBGo52vcdDKRwbsbXwtWpVcCqPhvkCnvO5sLa2y6E68p9PtPMs1MtD5pw/szja1ZqmIyU0ZWXJcNYGwACjQAefIS88I4UmHprTQWVfdidyx5kyRtPRJ+W8s7ZrwxCz3LMrRaGGIE9ntokACLT2IHlotPYgInkWgexEQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQP/Z",
    issponsored: true,
    name: "Cluemart Gas Stove Camping Stove Folding Furnace 2800W Outdoor Stove Picnic Cooking Gas Burners Backpacking Furnace Butane, Red",
    rating: 4,
    peoplerated: 1632,
    isdeal: true,
    mrp: 999,
    discount: 37,
    deliverydate: "2022-11-21",
    available: true,
    quantity: 3,
  },
  {
    id: "8",
    category: ["biking", "sporting"],
    img: "https://m.media-amazon.com/images/I/815NGlHhnoL._SL1500_.jpg",
    issponsored: true,
    name: "Probiker Synthetic Leather Motorcycle Gloves (Black, M)",
    rating: 3,
    peoplerated: 6531,
    isdeal: true,
    mrp: 450,
    discount: 38,
    deliverydate: "2022-11-23",
    available: true,
    quantity: 67,
  },
];


app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩");
});

app.get("/getdata", async function(request, response){
  const collections = await client.db("Webcode2_0").collection("products").find({});
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
