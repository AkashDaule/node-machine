const db = require("../config/db");

exports.getProductsPaginated = async (req, res) => {
  try {
    const page = req.query.page !== undefined ? parseInt(req.query.page) : 0;
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit) : 10;
    
    const pageNum = isNaN(page) ? 0 : Math.max(0, page);
    const limitNum = isNaN(limit) || limit < 1 ? 10 : limit;
    
    const offset = pageNum * limitNum;

    const products = await db.query(
      `
      SELECT 
        p.id AS product_id,
        p.name AS product_name,
        c.id AS category_id,
        c.name AS category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ORDER BY p.id
      LIMIT $1 OFFSET $2
      `,
      [limitNum, offset]
    );

    const count = await db.query("SELECT COUNT(*) FROM products");

    res.json({
      page: pageNum + 1,
      limit: limitNum,
      total: parseInt(count.rows[0].count),
      data: products.rows
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, category_id } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Product name is required" });
    }

    if (!category_id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const categoryCheck = await db.query(
      "SELECT id FROM categories WHERE id = $1",
      [category_id]
    );

    if (categoryCheck.rows.length === 0) {
      return res.status(400).json({ message: "Category does not exist" });
    }

    const result = await db.query(
      "INSERT INTO products(name, category_id) VALUES($1, $2) RETURNING *",
      [name.trim(), category_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error creating product" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_id } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Product name is required" });
    }

    if (!category_id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const productCheck = await db.query(
      "SELECT id FROM products WHERE id = $1",
      [id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const categoryCheck = await db.query(
      "SELECT id FROM categories WHERE id = $1",
      [category_id]
    );

    if (categoryCheck.rows.length === 0) {
      return res.status(400).json({ message: "Category does not exist" });
    }

    const result = await db.query(
      "UPDATE products SET name=$1, category_id=$2 WHERE id=$3 RETURNING *",
      [name.trim(), category_id, id]
    );

    res.json({
      message: "Product updated successfully",
      product: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const productCheck = await db.query(
      "SELECT id FROM products WHERE id = $1",
      [id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    await db.query("DELETE FROM products WHERE id=$1", [id]);

    res.json({ 
      message: "Product deleted successfully",
      deletedId: parseInt(id)
    });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product" });
  }
};
