const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({ product });
};
// const getAllProducts = async (req, res) => {
//   const products = await Product.find({});

//   res.status(StatusCodes.OK).json({ products, count: products.length });
// };
const getAllProducts = async (req, res) => {
    const { search, category, company, sort, price, shipping, page } = req.query;
    const queryObject = {};

    if (search) {
        queryObject.name = { $regex: search, $options: "i" };
    }
    if (category && category !== "all") {
        queryObject.category = { $regex: category, $options: "i" };
    }
    if (company && company !== "all") {
        queryObject.company = { $regex: company, $options: "i" };
    }
    if (shipping) {
        queryObject.freeShipping = shipping === "true" ? true : false;
    }
    if (price) {
        queryObject.price = { $lte: price };
    }

    // sort
    if (sort) {
        const sortParts = sort.split(",");

        // Validate sort options
        const validSorts = ["a-z", "z-a", "high", "low"];
        if (!sortParts.every((part) => validSorts.includes(part.toLowerCase()))) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Invalid sort parameter(s)" });
        }

        // Create sort object based on valid options
        sort = sortParts.reduce((acc, part) => {
            const direction = part.toLowerCase() === "low" || part.toLowerCase() === "a-z" ? -1 : 1;
            const field =
                part.toLowerCase() === "high" || part.toLowerCase() === "low" ? "price" : "name"; // Sort by price for "high"/"low"
            acc[field] = direction;
            return acc;
        }, {});
    }

    let result = Product.find(queryObject).sort(sort);
    // if (fields) {
    //     const fieldsList = fields.split(",").join(" ");
    //     result = result.select(fieldsList);
    // }

    const pages = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (pages - 1) * limit;

    result = result.skip(skip).limit(limit);
    // 23
    // 4 7 7 7 2

    const products = await result;

    // Extract unique companies using aggregation
    const distinctCompanies = await Product.aggregate([
        {
            $group: {
                _id: "$company", // Group by company field
            },
        },
    ]);
    const companies = distinctCompanies.map((company) => company._id);

    // Extract distinct categories using aggregation
    const distinctCategories = await Product.aggregate([
        {
            $group: {
                _id: "$category", // Group by category field
            },
        },
    ]);

    const categories = distinctCategories.map((category) => category._id);
    categories.push("all");
    companies.push("all");

    const count = await Product.countDocuments();
    const pageCount = Math.floor(count / limit) + 1;

    res.status(200).json({
        products,
        count: products.length,
        meta: { companies, categories, pageCount, pages },
    });
};
const getSingleProduct = async (req, res) => {
    const { id: productId } = req.params;

    const product = await Product.findOne({ _id: productId }).populate("reviews");

    if (!product) {
        throw new CustomError.NotFoundError(`No product with id : ${productId}`);
    }

    res.status(StatusCodes.OK).json({ product });
};
const updateProduct = async (req, res) => {
    const { id: productId } = req.params;

    const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
        new: true,
        runValidators: true,
    });

    if (!product) {
        throw new CustomError.NotFoundError(`No product with id : ${productId}`);
    }

    res.status(StatusCodes.OK).json({ product });
};
const deleteProduct = async (req, res) => {
    const { id: productId } = req.params;

    const product = await Product.findOne({ _id: productId });

    if (!product) {
        throw new CustomError.NotFoundError(`No product with id : ${productId}`);
    }

    await product.remove();
    res.status(StatusCodes.OK).json({ msg: "Success! Product removed." });
};
const uploadImage = async (req, res) => {
    if (!req.files) {
        throw new CustomError.BadRequestError("No File Uploaded");
    }
    const productImage = req.files.image;

    if (!productImage.mimetype.startsWith("image")) {
        throw new CustomError.BadRequestError("Please Upload Image");
    }

    const maxSize = 1024 * 1024;

    if (productImage.size > maxSize) {
        throw new CustomError.BadRequestError("Please upload image smaller than 1MB");
    }

    const imagePath = path.join(__dirname, "../public/uploads/" + `${productImage.name}`);
    await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
};
