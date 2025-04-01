import express from "express";
import cloudinary from "../lib/cloudinay.js";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;
    if (!image || !title || !caption || !rating)
      return res
        .status(400)
        .json({ message: "Por favor, preencha todos os campos." });

    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });

    await newBook.save();

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// const response = await fetch("http://localhost:3000/api/books?page=1&limit=5");

router.get("/", protectRoute, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    const totalBooks = await Book.countDocuments();

    res.send({
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Erro na rota para obter todos os livros", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book)
      return res.status(404).json({ message: "Livro nao encontrado." });

    if (book.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Nao autorizado." });

    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log("Erro ao excluir imagem de cloudinary", deleteError);
      }
    }

    await book.deleteOne();

    res.json({ message: "Livro deletado com sucesso." });
  } catch (error) {
    console.log("Erro ao deletar livro", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

router.get("/user", protectRoute, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(books);
  } catch (error) {
    console.log("Erro ao Buscar livros: ", error.message);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

export default router;
