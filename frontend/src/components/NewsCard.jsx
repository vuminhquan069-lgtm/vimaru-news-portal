import { Link } from "react-router-dom";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function NewsCard({ item }) {
  return (
    <article className="news-card">
      <div className="news-card__category">{item.category}</div>
      <h3 className="news-card__title">
        <Link to={`/tin-tuc/${item.id}`}>{item.title}</Link>
      </h3>
      <p className="news-card__summary">{item.summary}</p>
      <div className="news-card__meta">
        <span>{item.author}</span>
        <span>{formatDate(item.publishedAt)}</span>
      </div>
    </article>
  );
}
