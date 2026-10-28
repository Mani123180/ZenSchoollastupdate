require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const messageRoutes = require('./routes/messageRoutes');
const contactRoutes = require('./routes/contactRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const financeRoutes = require('./routes/financeRoutes');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDB();


app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/finance', financeRoutes);


app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'ZenSchool MERN Backend',
    timestamp: new Date().toISOString(),
  });
});


app.get('/', (req, res) => {
  res.send('ZenSchool ERP MERN API is running.');
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server Internal Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server Ready]: Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`[API Base]: http://localhost:${PORT}/api`);
});
