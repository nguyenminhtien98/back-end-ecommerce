const Product = require("../models/ProductModel");
const bcrypt = require("bcrypt");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      slug,
      image,
      clb,
      category,
      parent,
      parent_slug,
      price,
      productNew,
      sale,
      sold,
      countInstock,
      size,
      rating,
      trending,
      story,
      description_story,
      status,
      description,
    } = newProduct;
    try {
      const checkProduct = await Product.findOne({
        name: name,
      });
      if (checkProduct !== null) {
        resolve({
          status: "OK",
          message: "The name of product is already",
        });
      }
      const newProduct = await Product.create({
        name,
        slug,
        image,
        clb,
        category,
        parent,
        parent_slug,
        price,
        productNew,
        sale,
        sold,
        countInstock,
        size,
        rating,
        trending,
        story,
        description_story,
        status,
        description,
      });
      if (newProduct) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: newProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: "The Product is not defined",
        });
      }
      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: "The Product is not defined",
        });
      }
      await Product.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete Product success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = (limit, page, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments();
      if (filter) {
        const label = filter[0];
        const value = filter[1];
        const allObjectFilter = await Product.find({
          [label]: { $regex: filter[1], $options: "i" },
        });
        resolve({
          status: "OK",
          message: "Success",
          data: allObjectFilter,
          total: totalProduct,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalProduct / limit),
        });
      }
      const allProduct = await Product.find()
        .limit(limit)
        .skip(page * limit);
      resolve({
        status: "OK",
        message: "Get all Product success",
        data: allProduct,
        total: totalProduct,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({
        _id: id,
      }).exec();
      if (product === null) {
        resolve({
          status: "OK",
          message: "The product is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getProductBy = (value) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (value === "new-arrvals") {
        var productBy = await Product.find({
          productNew: true,
        }).exec();
      } else {
        var productBy = await Product.find({
          $or: [{ category: value }, { parent_slug: value }],
        }).exec();
      }
      if (value === "sale") {
        var productBy = await Product.find({
          sale: { $gt: 0 },
        }).exec();
      }
      if (value === "best-selling") {
        var productBy = await Product.find({
          sold: { $gt: 0 },
        }).exec();
      }
      if (value === "trending") {
        var productBy = await Product.find({
          trending: true,
        }).exec();
      }
      if (productBy === null) {
        resolve({
          status: "OK",
          message: "The product is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: productBy,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getProductBy,
  getDetailsProduct,
};
