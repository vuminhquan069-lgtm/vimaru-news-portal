import "dotenv/config";
import express from "express";
import cors from "cors";

import newsRoutes from "./routes/news.routes.js";
import pagesRoutes from "./routes/pages.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "vimaru-news-backend" });
});

app.use("/api/news", newsRoutes);
app.use("/api/pages", pagesRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Không tìm thấy endpoint" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
});

app.listen(PORT, () => {
  console.log(`[vimaru-news-backend] listening on port ${PORT}`);
});
