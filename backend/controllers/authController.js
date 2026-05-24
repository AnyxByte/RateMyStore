import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/db.js";

const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const signupUser = async (req, res) => {
  const { name, email, password, address, role, storeName } = req.body;

  if (!name || name.trim().length < 20 || name.trim().length > 60) {
    return res.status(400).json({
      error:
        "Validation Error: Name must be between 20 and 60 characters long.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: "Validation Error: Invalid email format structure." });
  }

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,16}$/;
  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Validation Error: Password must be 8-16 characters long and contain at least one uppercase letter and one special character.",
    });
  }

  if (!address || address.length > 400) {
    return res.status(400).json({
      error: "Validation Error: Address cannot exceed 400 characters.",
    });
  }

  const assignedRole =
    role && ["User", "StoreOwner"].includes(role) ? role : "User";

  if (assignedRole === "StoreOwner" && (!storeName || !storeName.trim())) {
    return res.status(400).json({
      error:
        "Validation Error: Store Business Name is required for Store Owners.",
    });
  }

  try {
    const userExistCheck = await query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );
    if (userExistCheck.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "An account with this email already exists." });
    }

    if (assignedRole === "StoreOwner") {
      const storeExistCheck = await query(
        "SELECT id FROM stores WHERE email = $1",
        [email],
      );
      if (storeExistCheck.rows.length > 0) {
        return res
          .status(409)
          .json({ error: "A store with this email already exists." });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await query("BEGIN");

    const insertUserQuery = `
      INSERT INTO users (name, email, password, address, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, address, role;
    `;
    const userResult = await query(insertUserQuery, [
      name,
      email,
      hashedPassword,
      address,
      assignedRole,
    ]);
    const newUser = userResult.rows[0];

    if (assignedRole === "StoreOwner") {
      const insertStoreQuery = `
        INSERT INTO stores (name, email, address, owner_id)
        VALUES ($1, $2, $3, $4);
      `;

      await query(insertStoreQuery, [
        storeName.trim(),
        email,
        address,
        newUser.id,
      ]);
    }

    await query("COMMIT");

    const token = generateToken(newUser.id, newUser.email, newUser.role);

    res.status(201).json({
      message: "Registration successful!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
        role: newUser.role,
        token,
      },
    });
  } catch (error) {
    await query("ROLLBACK");
    console.error("Signup DB Transaction Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error during registration processing." });
  }
};
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Please provide both email and password parameters." });
  }

  try {
    const userResult = await query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid login credentials." });
    }

    const user = userResult.rows[0];

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid login credentials." });
    }

    const token = generateToken(user.id, user.email, user.role);

    res.status(200).json({
      message: "Login authentication verified.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error("Login DB Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error running authentication checks." });
  }
};

export const verifyUserRole = async (req, res) => {
  const { desiredRole } = req.body;

  if (!desiredRole) {
    return res
      .status(400)
      .json({ error: "Missing parameter: 'desiredRole' is required." });
  }

  try {
    const dbResult = await query("SELECT role FROM users WHERE id = $1", [
      req.user.id,
    ]);

    if (dbResult.rows.length === 0) {
      return res.status(404).json({
        status: "Unauthorized",
        error: "Account profile no longer exists in the system.",
      });
    }

    const currentActualRole = dbResult.rows[0].role;

    if (currentActualRole === desiredRole) {
      return res.status(200).json({
        status: "Authorized",
        role: currentActualRole,
        message: `Access verified for target workspace: ${desiredRole}.`,
      });
    }

    return res.status(403).json({
      status: "Unauthorized",
      error: `Access Denied: Profile role '${currentActualRole}' does not match requested permission level.`,
    });
  } catch (error) {
    console.error("Database role verification error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error validating credentials." });
  }
};
