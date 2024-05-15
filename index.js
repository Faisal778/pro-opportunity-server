const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173"],
  Credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors({ corsOptions }));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zedvr4o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    const jobsCollection = client.db("proOpportunity").collection("jobs");

    const resumeCollection = client.db("proOpportunity").collection("appliedResumes")


    // Get all data from database

    app.get("/jobs", async (req, res) => {
      const result = await jobsCollection.find().toArray()

      res.send(result)
    });


    //get single data from database using id

    app.get('/job/:id', async (req, res)=>{
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await jobsCollection.findOne(query)
        res.send(result)
    })

    //save applied resume data in database
    app.post('/appliedResumes', async(req, res)=> {
        const applyData = req.body
        const result = await resumeCollection.insertOne(applyData)
        res.send(result)
    })

     //save job data in database
     app.post('/job', async(req, res)=> {
        const jobData = req.body
        const result = await jobsCollection.insertOne(jobData)
        res.send(result)
    })

    // get jobs according to specific user

    app.get('/jobs/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const result = await jobsCollection.find(query).toArray();
        res.send(result);
      });
      


    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => console.log(`server running on port ${port}`));
