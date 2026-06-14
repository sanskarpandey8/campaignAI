require("dotenv").config();

const dashboardRoutes = require(
  "./routes/dashboardRoutes"
);

const copilotRoutes = require(
  "./routes/copilotRoutes"
);

const aiRoutes = require(
  "./routes/aiRoutes"
);

const statsRoutes = require(
  "./routes/statsRoutes"
);

const receiptRoutes = require(
  "./routes/receiptRoutes"
);


const campaignRoutes = require(
  "./routes/campaignRoutes"
);

const subjectRoutes = require(
  "./routes/subjectRoutes"
);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const customerRoutes = require("./routes/customerRoutes");

const orderRoutes = require(
  "./routes/orderRoutes"
);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/campaigns",
  campaignRoutes
);

app.use(
  "/api/receipts",
  receiptRoutes
);

app.use(
  "/api/stats",
  statsRoutes
);

app.use("/api/ai", aiRoutes);

app.use(
  "/api/copilot",
  copilotRoutes
);

app.use(
  "/api/subjects",
  subjectRoutes
);


// Health Check Route
app.get("/", (req, res) => {
  res.send("CampaignGPT Backend Running");
});



const PORT = process.env.PORT || 5000;

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Error:", error);
  });