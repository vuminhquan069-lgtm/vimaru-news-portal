import jwt from "jsonwebtoken";

export function login(req, res) {
  const { password } = req.body || {};
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const jwtSecret = process.env.JWT_SECRET || "vimaru-jwt-secret-change-me";
  const expiresIn = process.env.JWT_EXPIRES_IN || "2h";

  if (password !== adminPassword) {
    return res.status(401).json({ message: "Sai mật khẩu quản trị" });
  }

  const token = jwt.sign({ role: "admin" }, jwtSecret, { expiresIn });
  res.json({ token, expiresIn });
}
