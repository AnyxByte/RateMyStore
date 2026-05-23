import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ error: "Not authorized: Invalid or expired token." });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ error: "Not authorized: No token provided." });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access Denied: Role '${req.user?.role || "Guest"}' is unauthorized for this route.`,
      });
    }
    next();
  };
};
