// import models
const Product = require("./Product.js");
const Category = require("./Category.js");
const Tag = require("./Tag.js");
const ProductTag = require("./ProductTag.js");

// Products belongsTo Category
Product.belongsTo(Category, {
    foreignKey: "category_id",
});

// Categories have many Products
Category.hasMany(Product, {
    foreignKey: "category_id",
});

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
    through: {
        model: ProductTag,
        foreignKey: "product_id",
    },
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
    through: {
        model: ProductTag,
        foreignKey: "tag_id",
    },
});

module.exports = {
    Product,
    Category,
    Tag,
    ProductTag,
};
