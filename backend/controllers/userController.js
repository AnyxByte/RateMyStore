import { query } from "../config/db.js";
import bcrypt from "bcryptjs";

export const fetchUsers = async (req, res) => {
  try {
    const sqlQuery = `
      SELECT 
        u.id, u.name, u.email, u.address, u.role,
        COALESCE(AVG(r.rating), 0)::FLOAT as store_rating
      FROM users u
      LEFT JOIN stores s ON u.id = s.owner_id
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY u.id
      ORDER BY u.created_at DESC;
    `;

    const result = await query(sqlQuery);
    res.status(200).json({ users: result.rows });
  } catch (error) {
    console.error("Admin FetchUsers Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error fetching users listing." });
  }
};

export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,16}$/;
  if (!newPassword || !passwordRegex.test(newPassword)) {
    return res.status(400).json({
      error:
        "Validation Error: New password must be 8-16 characters long, contain an uppercase letter, and one special character.",
    });
  }

  try {
    const userResult = await query("SELECT password FROM users WHERE id = $1", [
      req.user.id,
    ]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User account profile not found." });
    }

    const passwordMatch = await bcrypt.compare(
      oldPassword,
      userResult.rows[0].password,
    );
    if (!passwordMatch) {
      return res.status(401).json({
        error:
          "Authentication Failed: Current password statement is incorrect.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedNewPassword,
      req.user.id,
    ]);
    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("UpdatePassword Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error executing password adjustment." });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, address, role } = req.body;

  if (name && (name.trim().length < 20 || name.trim().length > 60)) {
    return res.status(400).json({
      error:
        "Validation Error: Name must remain between 20 and 60 characters long.",
    });
  }
  if (address && address.length > 400) {
    return res.status(400).json({
      error:
        "Validation Error: Address parameter maximum layout capacity is 400 characters.",
    });
  }

  try {
    const checkUser = await query("SELECT role FROM users WHERE id = $1", [id]);
    if (checkUser.rows.length === 0) {
      return res.status(404).json({ error: "Target user account not found." });
    }

    const updateQuery = `
      UPDATE users 
      SET name = COALESCE($1, name), 
          address = COALESCE($2, address),
          role = COALESCE($3, role)
      WHERE id = $4
      RETURNING id, name, email, address, role;
    `;

    const result = await query(updateQuery, [name, address, role, id]);
    res.status(200).json({
      message: "Profile parameters modified successfully.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("UpdateUsers Profile Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error executing database updates." });
  }
};
