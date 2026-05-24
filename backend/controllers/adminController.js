import bcrypt from "bcryptjs";
import { query } from "../config/db.js";

export const fetchAdminExtendedDashboard = async (req, res) => {
  try {
    const usersQuery = `
      SELECT 
        id, 
        name, 
        email, 
        address, 
        role, 
        created_at
      FROM users
      ORDER BY created_at DESC;
    `;

    const storesQuery = `
      SELECT 
        s.id as store_id,
        s.name as store_name,
        s.email as store_email,
        s.address as store_address,
        s.owner_id,
        COALESCE(AVG(r.rating), 0)::FLOAT as overall_rating,
        COUNT(DISTINCT r.id) as total_ratings_count
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id, s.name, s.email, s.address, s.owner_id
      ORDER BY s.name ASC;
    `;

    const [usersResult, storesResult] = await Promise.all([
      query(usersQuery),
      query(storesQuery),
    ]);

    res.status(200).json({
      success: true,
      metrics: {
        totalUsers: usersResult.rows.length,
        totalStores: storesResult.rows.length,
      },
      users: usersResult.rows,
      stores: storesResult.rows,
    });
  } catch (error) {
    console.error("FetchAdminExtendedDashboard Error:", error);
    res.status(500).json({
      error: "Internal Server Error compiling master system records.",
    });
  }
};

export const adminCreateUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || name.trim().length < 20 || name.trim().length > 60) {
    return res.status(400).json({
      error: "Validation Error: Name must be between 20 and 60 characters.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: "Validation Error: Invalid email format structure." });
  }

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;
  if (!password || !passwordRegex.test(password)) {
    return res
      .status(400)
      .json({ error: "Validation Error: Password must meet criteria rules." });
  }

  if (!address || address.length > 400) {
    return res.status(400).json({
      error: "Validation Error: Address cannot exceed 400 characters.",
    });
  }

  const roleMapping = {
    admin: "Admin",
    user: "User",
    store_owner: "StoreOwner",
  };
  const standardizedRole = roleMapping[role] || "User";

  try {
    const userCheck = await query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (userCheck.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertUserQuery = `
      INSERT INTO users (name, email, password, address, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, address, role;
    `;

    const result = await query(insertUserQuery, [
      name.trim(),
      email.toLowerCase().trim(),
      hashedPassword,
      address.trim(),
      standardizedRole,
    ]);

    res.status(201).json({
      success: true,
      message: "User account generated successfully by Administrator.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Admin Create User DB Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error compiling new profile registry." });
  }
};

export const addNewStore = async (req, res) => {
  if (!req.user || req.user.role !== "Admin") {
    return res.status(403).json({
      success: false,
      error: "Access Denied: Only System Admin can execute this action.",
    });
  }

  const { name, email, password, address } = req.body;

  if (!name || name.trim().length < 20 || name.trim().length > 60) {
    return res
      .status(400)
      .json({
        error:
          "Validation Error: Store Name must be between 20 and 60 characters long.",
      });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: "Validation Error: Invalid email format structure." });
  }

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;
  if (!password || !passwordRegex.test(password)) {
    return res
      .status(400)
      .json({
        error:
          "Validation Error: Password must be 8-16 characters with 1 uppercase and 1 special char.",
      });
  }

  if (!address || address.length > 400) {
    return res
      .status(400)
      .json({
        error:
          "Validation Error: Store Address capacity cannot exceed 400 characters.",
      });
  }

  try {
    const userConflict = await query("SELECT id FROM users WHERE email = $1", [
      email.toLowerCase().trim(),
    ]);
    const storeConflict = await query(
      "SELECT id FROM stores WHERE email = $1",
      [email.toLowerCase().trim()],
    );

    if (userConflict.rows.length > 0 || storeConflict.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "An account or store with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await query("BEGIN");

    const insertUserSQL = `
      INSERT INTO users (name, email, password, address, role)
      VALUES ($1, $2, $3, $4, 'StoreOwner')
      RETURNING id;
    `;
    const userResult = await query(insertUserSQL, [
      name.trim(),
      email.toLowerCase().trim(),
      hashedPassword,
      address.trim(),
    ]);
    const newOwnerId = userResult.rows[0].id;

    const insertStoreSQL = `
      INSERT INTO stores (name, email, address, owner_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, address, owner_id;
    `;
    const storeResult = await query(insertStoreSQL, [
      name.trim(),
      email.toLowerCase().trim(),
      address.trim(),
      newOwnerId,
    ]);

    await query("COMMIT");

    res.status(201).json({
      success: true,
      message:
        "Storefront registered and Merchant User account provisioned smoothly.",
      store: storeResult.rows[0],
    });
  } catch (error) {
    await query("ROLLBACK");
    console.error("Admin Add New Store Transaction Failure:", error);
    res
      .status(500)
      .json({
        error: "Internal Server Error executing atomic store registration.",
      });
  }
};
