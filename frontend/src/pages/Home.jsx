import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import NewsCard from "../components/NewsCard";

export default function Home() {
  const [pages, setPages] = useState(null);
  const [news, setNews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getPages().then(setPages).catch((err) => setError(err.message));
    api
      .getNews({ limit: 3 })
      .then((data) => setNews(data.items))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="error">Không thể tải dữ liệu: {error}</p>;
  if (!pages) return <p>Đang tải...</p>;

  return (
    <>
      <section className="hero">
        <h1>{pages.school.name}</h1>
        <p className="hero__slogan">{pages.school.slogan}</p>
        <p className="hero__english">{pages.school.englishName} · Thành lập {pages.school.founded}</p>
        <Link className="btn" to="/gioi-thieu">
          Tìm hiểu về trường
        </Link>
      </section>

      <section className="section">
        <div className="section__header">
          <h2>Tin tức mới nhất</h2>
          <Link to="/tin-tuc">Xem tất cả →</Link>
        </div>
        <div className="news-grid">
          {news.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </>
  );
}
