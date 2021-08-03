// import models
const Product = require("./Product");
const Category = require("./Category");
const Tag = require("./Tag");
const ProductTag = require("./ProductTag");

// Products belongsTo Category
Products.belongsTo(Category, {
    foreignKey: "category_id",
});

// Categories have many Products
Category.belongsToMany(Products, {
    foreignKey: "product_id",
});

// Products belongToMany Tags (through ProductTag)
Products.belongsToMany(Tags, {
    through: {
        model: ProductTag,
        unique: false,
    },
    as: "product_tag",
});

// Tags belongToMany Products (through ProductTag)
Tags.belongsToMany(Products, {
    through: {
        model: ProductTag,
        unique: false,
    },
    as: "product_tag",
});

module.exports = {
    Product,
    Category,
    Tag,
    ProductTag,
};
