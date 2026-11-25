import { useEffect, useState } from "react";
import { api } from "../services/api";
import NewsCard from "../components/NewsCard";

export default function NewsList() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getNews({ search, page, limit: 6 })
      .then((data) => {
        setItems(data.items);
        setPagination(data.pagination);
      })
      .catch((err) => setError(err.message));
  }, [search, page]);

  return (
    <section className="section">
      <h1>Tin tức nhà trường</h1>

      <input
        className="search-input"
        type="text"
        placeholder="Tìm kiếm theo tiêu đề..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
      />

      {error && <p className="error">{error}</p>}

      <div className="news-grid">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

      {items.length === 0 && !error && <p>Không tìm thấy tin tức phù hợp.</p>}

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            ← Trước
          </button>
          <span>
            Trang {pagination.page} / {pagination.totalPages}
          </span>
          <button disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>
            Sau →
          </button>
        </div>
      )}
    </section>
  );
}
