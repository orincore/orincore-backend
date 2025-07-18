"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const errorHandler_1 = require("./middleware/errorHandler");
const portfolio_1 = __importDefault(require("./routes/portfolio"));
const reviews_1 = __importDefault(require("./routes/reviews"));
const contact_1 = __importDefault(require("./routes/contact"));
const upload_1 = __importDefault(require("./routes/upload"));
const auth_1 = __importDefault(require("./routes/auth"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(errorHandler_1.errorHandler);
// Health check
app.get('/', (_req, res) => {
    res.json({ status: 'Server is Running' });
});
app.use('/api/portfolio', portfolio_1.default);
app.use('/api/reviews', reviews_1.default);
app.use('/api/contact', contact_1.default);
app.use('/api/upload', upload_1.default);
app.use('/api/auth', auth_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
