const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

// FIND ALL TAGS, DISPLAY ANY ASSOCIATED 'Product' DATA
router.get("/", async (req, res) => {
    try {
        const tagData = await Tag.findAll({
            include: [Product],
        });
        res.status(200).json(tagData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// FIND ONE TAG, DISPLAY ANY ASSOCIATED 'Product' DATA
router.get("/:id", async (req, res) => {
    try {
        const tagData = await Tag.findByPk(req.params.id, {
            include: [Product],
        });
        if (!tagData) {
            res.status(404).json({
                message: "No category found with this id!",
            });
            return;
        }
        res.status(200).json(tagData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// CREATE A NEW TAG
router.post("/", async (req, res) => {
    try {
        const tagData = await Tag.create({
            tag_name: req.body.tag_name,
        });

        res.status(200).json(tagData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// UPDATE TAG NAME
router.put("/:id", async (req, res) => {
    const tag_id = req.params.id;
    const { tag_name } = req.body;
    try {
        await Tag.update({ tag_name: tag_name }, { where: { id: tag_id } });
        res.status(200).json("Tag updated");
    } catch (err) {
        res.status(400).json(err);
    }
});

// DELETE TAG
router.delete("/:id", async (req, res) => {
    try {
        const tagData = await Tag.destroy({
            where: {
                id: req.params.id,
            },
        });

        if (!tagData) {
            res.status(404).json({
                message: "No category found with this id!",
            });
            return;
        }

        res.status(200).json(tagData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
