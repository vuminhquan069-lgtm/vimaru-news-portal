import jwt from "jsonwebtoken";

export function requireAdmin(req, res, next) {
  const header = req.header("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Yêu cầu quyền quản trị" });
  }

  try {
    // Token được cấp bởi auth-service; backend chỉ xác thực bằng chung JWT_SECRET,
    // không gọi lại auth-service cho mỗi request.
    req.admin = jwt.verify(token, process.env.JWT_SECRET || "vimaru-jwt-secret-change-me");
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
}
