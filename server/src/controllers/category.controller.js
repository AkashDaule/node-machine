const db = require("../config/db");

exports.getAllCategories = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM categories ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const result = await db.query(
      "INSERT INTO categories(name) VALUES($1) RETURNING *",
      [name]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error creating category" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    await db.query(
      "UPDATE categories SET name = $1 WHERE id = $2",
      [name, id]
    );

    res.json({ message: "Category updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating category" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const check = await db.query(
      "SELECT COUNT(*) FROM products WHERE category_id = $1",
      [id]
    );

    if (parseInt(check.rows[0].count) > 0) {
      return res.status(400).json({
        message:
          "Cannot delete this category. Products are linked to it. Please move or delete the products first."
      });
    }

    await db.query(
      "DELETE FROM categories WHERE id = $1",
      [id]
    );

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting category" });
  }
};
