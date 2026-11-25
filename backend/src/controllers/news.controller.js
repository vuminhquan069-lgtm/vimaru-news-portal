import db from "../services/jsonDatabase.js";

const FILE = "news.json";

async function loadNews() {
  const data = await db.readJson(FILE);
  return data.news || [];
}

async function saveNews(news) {
  await db.writeJson(FILE, { news });
}

export async function getAllNews(req, res, next) {
  try {
    const { search = "", category = "", page = 1, limit = 6 } = req.query;
    let news = await loadNews();

    if (search) {
      const keyword = search.toLowerCase();
      news = news.filter((item) => item.title.toLowerCase().includes(keyword));
    }
    if (category) {
      news = news.filter((item) => item.category === category);
    }

    news = news.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 6);
    const total = news.length;
    const start = (pageNum - 1) * limitNum;
    const items = news.slice(start, start + limitNum);

    res.json({
      items,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getNewsById(req, res, next) {
  try {
    const news = await loadNews();
    const item = news.find((n) => String(n.id) === String(req.params.id));
    if (!item) {
      return res.status(404).json({ message: "Không tìm thấy tin tức" });
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function createNews(req, res, next) {
  try {
    const { title, summary, content, thumbnail, author, category } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Thiếu tiêu đề hoặc nội dung" });
    }

    const news = await loadNews();
    const newItem = {
      id: news.length ? Math.max(...news.map((n) => n.id)) + 1 : 1,
      title,
      summary: summary || "",
      content,
      thumbnail: thumbnail || "",
      author: author || "Phòng Truyền thông",
      category: category || "Tin tức",
      publishedAt: new Date().toISOString(),
    };

    news.push(newItem);
    await saveNews(news);
    res.status(201).json(newItem);
  } catch (err) {
    next(err);
  }
}

export async function updateNews(req, res, next) {
  try {
    const news = await loadNews();
    const index = news.findIndex((n) => String(n.id) === String(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: "Không tìm thấy tin tức" });
    }

    const { title, summary, content, thumbnail, author, category } = req.body;
    news[index] = {
      ...news[index],
      title: title ?? news[index].title,
      summary: summary ?? news[index].summary,
      content: content ?? news[index].content,
      thumbnail: thumbnail ?? news[index].thumbnail,
      author: author ?? news[index].author,
      category: category ?? news[index].category,
    };

    await saveNews(news);
    res.json(news[index]);
  } catch (err) {
    next(err);
  }
}

export async function deleteNews(req, res, next) {
  try {
    const news = await loadNews();
    const index = news.findIndex((n) => String(n.id) === String(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: "Không tìm thấy tin tức" });
    }

    const [removed] = news.splice(index, 1);
    await saveNews(news);
    res.json(removed);
  } catch (err) {
    next(err);
  }
}
