import { query } from "../config/db.js";

export const addRatingToStore = async (req, res) => {
  const { storeId, rating } = req.body;
  const userId = req.user.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      error:
        "Validation Error: Rating scores must be integers ranging strictly between 1 and 5.",
    });
  }

  try {
    const storeCheck = await query("SELECT id FROM stores WHERE id = $1", [
      storeId,
    ]);
    if (storeCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Target storefront record not found." });
    }

    const upsertRatingQuery = `
      INSERT INTO ratings (user_id, store_id, rating)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, store_id) 
      DO UPDATE SET rating = EXCLUDED.rating, created_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const result = await query(upsertRatingQuery, [userId, storeId, rating]);

    res.status(200).json({
      message: "Rating processed successfully!",
      rating: result.rows[0],
    });
  } catch (error) {
    console.error("AddRatingToStore Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error updating store rating metrics." });
  }
};

export const fetchUserStoreFeed = async (req, res) => {
  const userId = req.user.id;
  const { name, address } = req.query;

  try {
    let sqlQuery = `
      SELECT 
        s.id as store_id,
        s.name as store_name,
        s.email as store_email,
        s.address as store_address,
        COALESCE(AVG(r_all.rating), 0)::FLOAT as overall_rating,
        COUNT(DISTINCT r_all.id) as total_ratings_count, -- Added to display the (count) in your UI!
        COALESCE(MAX(CASE WHEN r_user.user_id = $1 THEN r_user.rating END), 0) as user_submitted_rating
      FROM stores s
      LEFT JOIN ratings r_all ON s.id = r_all.store_id
      LEFT JOIN ratings r_user ON s.id = r_user.store_id AND r_user.user_id = $1
    `;

    const queryParams = [userId];
    let whereClauses = [];

    if (name && name.trim() !== "") {
      queryParams.push(`%${name.trim()}%`);
      whereClauses.push(`s.name ILIKE $${queryParams.length}`);
    }

    if (address && address.trim() !== "") {
      queryParams.push(`%${address.trim()}%`);
      whereClauses.push(`s.address ILIKE $${queryParams.length}`);
    }

    if (whereClauses.length > 0) {
      sqlQuery += ` WHERE ` + whereClauses.join(" AND ");
    }

    sqlQuery += `
      GROUP BY s.id, s.name, s.email, s.address
      ORDER BY s.name ASC;
    `;

    const result = await query(sqlQuery, queryParams);
    res.status(200).json({ stores: result.rows });
  } catch (error) {
    console.error("FetchUserStoreFeed Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error compiling store directory feed." });
  }
};

export const fetchOwnerDashboard = async (req, res) => {
  const userId = req.user.id;

  try {
    const storeResult = await query(
      "SELECT id, name, address FROM stores WHERE owner_id = $1",
      [userId],
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({
        error: "No registered business profile found linked to this account.",
      });
    }

    const store = storeResult.rows[0];

    const metricsResult = await query(
      "SELECT COALESCE(AVG(rating), 0)::FLOAT as average_rating FROM ratings WHERE store_id = $1",
      [store.id],
    );

    const reviewersResult = await query(
      `
      SELECT 
        u.name as reviewer_name,
        u.email as reviewer_email,
        r.rating as submitted_score,
        r.created_at as reviewed_at
      FROM ratings r
      INNER JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.created_at DESC;
    `,
      [store.id],
    );

    res.status(200).json({
      storeDetails: store,
      averageRating: metricsResult.rows[0].average_rating,
      reviewers: reviewersResult.rows[0] ? reviewersResult.rows : [],
    });
  } catch (error) {
    console.error("FetchOwnerDashboard Error:", error);
    res.status(500).json({
      error: "Internal Server Error loading storefront dashboard profiles.",
    });
  }
};
