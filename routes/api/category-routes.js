const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

// FIND ALL CATEGORIES, DISPLAY ANY ASSOCIATED 'Product' DATA
router.get("/", async (req, res) => {
    try {
        const categoryData = await Category.findAll({
            include: [Product],
        });
        res.status(200).json(categoryData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// FIND ONE CATEGORY, DISPLAY ANY ASSOCIATED 'Product' DATA
router.get("/:id", async (req, res) => {
    try {
        const categoryData = await Category.findByPk(req.params.id, {
            include: [Product],
        });
        if (!categoryData) {
            res.status(404).json({
                message: "No category found with this id!",
            });
            return;
        }
        res.status(200).json(categoryData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// CREATE A CATEGORY
router.post("/", async (req, res) => {
    try {
        const newCategory = await Category.create({
            category_name: req.body.category_name,
        });

        res.status(200).json({
            message: "Category created!",
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

// UPDATE CATEGORY NAME
router.put("/:id", async (req, res) => {
    const cat_id = req.params.id;
    const { category_name } = req.body;
    try {
        await Category.update(
            { category_name: category_name },
            { where: { id: cat_id } }
        );
        res.status(200).json({
            message: "Category updated!",
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

// DELETE A CATEGORY
router.delete("/:id", async (req, res) => {
    try {
        const categoryData = await Category.destroy({
            where: {
                id: req.params.id,
            },
        });

        if (!categoryData) {
            res.status(404).json({
                message: "No category found with this id!",
            });
            return;
        }

        res.status(200).json({
            message: "Category deleted!",
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
