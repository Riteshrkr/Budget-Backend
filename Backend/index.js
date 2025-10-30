import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
import expenseRoute from './routes/expense.route.js';
dotenv.config();

const app = express();
app.use(express.json())
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
const allowedOrigins = [
  'http://localhost:5173',
  process.env.URL,
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/user',userRoute);
app.use('/api/expense',expenseRoute);

const startServer = async () => {
    try { 
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();