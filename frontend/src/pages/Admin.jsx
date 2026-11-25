import { useEffect, useState } from "react";
import { api } from "../services/api";

const emptyForm = { title: "", summary: "", content: "", thumbnail: "", author: "", category: "" };

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem("vimaru-admin-jwt") || "");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadNews = () => {
    api
      .getNews({ limit: 100 })
      .then((data) => setItems(data.items))
      .catch((err) => setMessage(err.message));
  };

  useEffect(() => {
    if (token) loadNews();
  }, [token]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    try {
      const { token: newToken } = await api.adminLogin(password);
      sessionStorage.setItem("vimaru-admin-jwt", newToken);
      setToken(newToken);
    } catch (err) {
      setLoginError(err.message);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("vimaru-admin-jwt");
    setToken("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    try {
      if (editingId) {
        await api.updateNews(editingId, form, token);
        setMessage("Đã cập nhật tin tức.");
      } else {
        await api.createNews(form, token);
        setMessage("Đã thêm tin tức mới.");
      }
      setForm(emptyForm);
      setEditingId(null);
      loadNews();
    } catch (err) {
      setMessage(err.message);
    }
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      summary: item.summary,
      content: item.content,
      thumbnail: item.thumbnail,
      author: item.author,
      category: item.category,
    });
  }

  async function handleDelete(id) {
    if (!confirm("Xóa tin tức này?")) return;
    try {
      await api.deleteNews(id, token);
      loadNews();
    } catch (err) {
      setMessage(err.message);
    }
  }

  if (!token) {
    return (
      <section className="section admin-login">
        <h1>Đăng nhập quản trị</h1>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Mật khẩu quản trị"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn" type="submit">
            Đăng nhập
          </button>
        </form>
        {loginError && <p className="error">{loginError}</p>}
      </section>
    );
  }

  return (
    <section className="section">
      <div className="section__header">
        <h1>Quản trị tin tức</h1>
        <button className="btn btn--secondary" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          placeholder="Tiêu đề"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          placeholder="Tóm tắt"
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
        />
        <textarea
          placeholder="Nội dung"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <input
          placeholder="Ảnh đại diện (URL)"
          value={form.thumbnail}
          onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
        />
        <input
          placeholder="Tác giả"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
        <input
          placeholder="Danh mục"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <div className="admin-form__actions">
          <button className="btn" type="submit">
            {editingId ? "Cập nhật" : "Thêm tin tức"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Danh mục</th>
            <th>Ngày đăng</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.category}</td>
              <td>{new Date(item.publishedAt).toLocaleDateString("vi-VN")}</td>
              <td className="admin-table__actions">
                <button onClick={() => handleEdit(item)}>Sửa</button>
                <button onClick={() => handleDelete(item.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
