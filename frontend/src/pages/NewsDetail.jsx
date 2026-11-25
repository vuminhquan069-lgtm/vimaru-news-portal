import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";

export default function NewsDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getNewsById(id)
      .then(setItem)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="error">Không tìm thấy tin tức: {error}</p>;
  if (!item) return <p>Đang tải...</p>;

  return (
    <section className="section news-detail">
      <Link to="/tin-tuc">← Quay lại danh sách tin tức</Link>
      <div className="news-detail__category">{item.category}</div>
      <h1>{item.title}</h1>
      <div className="news-detail__meta">
        <span>{item.author}</span>
        <span>{new Date(item.publishedAt).toLocaleDateString("vi-VN")}</span>
      </div>
      <p className="news-detail__content">{item.content}</p>
    </section>
  );
}
