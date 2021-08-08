const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// FIND ALL PRODUCTS, DISPLAY ANY ASSOCIATED 'Product' AND 'Tag' DATA
router.get("/", async (req, res) => {
    try {
        const productData = await Product.findAll({
            include: [Category, Tag],
        });
        res.status(200).json(productData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// FIND ONE PRODUCT, DISPLAY ANY ASSOCIATED 'Product' AND 'Tag' DATA
router.get("/:id", async (req, res) => {
    try {
        const productData = await Product.findByPk(req.params.id, {
            include: [Category, { model: Tag, through: ProductTag }],
        });
        if (!productData) {
            res.status(404).json({
                message: "No product found with this id!",
            });
            return;
        }
        res.status(200).json(productData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// CREATE NEW PRODUCT
router.post("/", (req, res) => {
    Product.create({
        product_name: req.body.product_name,
        price: req.body.price,
        stock: req.body.stock,
        category_id: req.body.category_id,
    })
        .then((product) => {
            if (req.body.tagIds.length) {
                const productTagIdArr = req.body.tagIds.map((tag_id) => {
                    return {
                        product_id: product.id,
                        tag_id,
                    };
                });
                res.status(200).json(product);
                return ProductTag.bulkCreate(productTagIdArr);
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
});

// UPDATE A PRODUCT
router.put("/:id", (req, res) => {
    Product.update(req.body, {
        where: {
            id: req.params.id,
        },
    })
        .then((product) => {
            return ProductTag.findAll({ where: { product_id: req.params.id } });
        })
        .then((productTags) => {
            const productTagIds = productTags.map(({ tag_id }) => tag_id);
            const newProductTags = req.body.tagIds
                .filter((tag_id) => !productTagIds.includes(tag_id))
                .map((tag_id) => {
                    return {
                        product_id: req.params.id,
                        tag_id,
                    };
                });
            // SELECTS TAGS TO DESTROY FROM SELECTED PRODUCT
            const productTagsToRemove = productTags
                .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
                .map(({ id }) => id);

            return Promise.all([
                ProductTag.destroy({ where: { id: productTagsToRemove } }),
                ProductTag.bulkCreate(newProductTags),
            ]);
        })
        .then((updatedProductTags) => res.json(updatedProductTags))
        .catch((err) => {
            res.status(400).json(err);
        });
});

// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
    try {
        const productData = await Product.destroy({
            where: {
                id: req.params.id,
            },
        });

        if (!productData) {
            res.status(404).json({
                message: "No product found with this id!",
            });
            return;
        }

        res.status(200).json(productData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
