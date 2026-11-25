import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function About() {
  const [pages, setPages] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getPages().then(setPages).catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="error">Không thể tải dữ liệu: {error}</p>;
  if (!pages) return <p>Đang tải...</p>;

  const { school, faculties, institutes } = pages;

  return (
    <section className="section">
      <h1>Giới thiệu về {school.name}</h1>

      <div className="about-block">
        <h2>Lịch sử hình thành</h2>
        <p>{school.history}</p>
      </div>

      <div className="about-block">
        <h2>Sứ mệnh</h2>
        <p>{school.mission}</p>
      </div>

      <div className="about-block">
        <h2>Tầm nhìn</h2>
        <p>{school.vision}</p>
      </div>

      <div className="about-block">
        <h2>Các khoa đào tạo</h2>
        <ul className="faculty-list">
          {faculties.map((f) => (
            <li key={f.id}>
              <strong>{f.name}</strong> — {f.description}
            </li>
          ))}
        </ul>
      </div>

      <div className="about-block">
        <h2>Viện / Trung tâm</h2>
        <ul>
          {institutes.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </div>

      <div className="about-block">
        <h2>Liên hệ</h2>
        <p>Địa chỉ: {school.contact.address}</p>
        <p>Điện thoại: {school.contact.phone}</p>
        <p>Email: {school.contact.email}</p>
        <p>
          Website:{" "}
          <a href={school.contact.website} target="_blank" rel="noreferrer">
            {school.contact.website}
          </a>
        </p>
      </div>
    </section>
  );
}
