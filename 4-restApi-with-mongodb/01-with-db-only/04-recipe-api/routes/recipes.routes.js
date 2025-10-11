const express = require("express");
const Recipe = require("../models/recipes.model.js");

const router = express.Router();

// * `POST /api/recipes` → Create a new recipe
router.post("/", async (req, res) => {
  const {
    title,
    description,
    cuisine,
    ingredients,
    steps,
    createdBy,
    averageRating,
  } = req.body;
  if (!title || !description || !cuisine || !ingredients) {
    return res.status(400).json({
      message: "Title, description, cuisine, ingredients are must !",
    });
  }
  if (averageRating < 1 || averageRating > 10) {
    return res.status(400).json({
      message: "Rating must be range [1, 10] !",
    });
  }
  try {
    const newRecipe = await Recipe.create({
      title: title,
      description: description,
      cuisine: cuisine,
      ingredients: ingredients,
      steps: steps,
      createdBy: createdBy,
      averageRating: averageRating,
    });

    res.status(201).json({
      message: "Here's the new Recipe data: ",
      recipe: newRecipe,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// * `GET /api/recipes` → Get all recipes (with optional filtering by ingredient or cuisine type)
router.get("/", async (req, res) => {
  try {
    const { ingredients, cuisine } = req.query;

    const filter = {};

    if (cuisine) {
      // adds a key-value pair to the filter
      filter.cuisine = cuisine;
    }

    if (ingredients) {
      filter["ingredients.name"] = ingredients; // Search inside the embedded array
    }

    const recipe = await Recipe.find(filter);

    if (recipe.length === 0) {
      return res.status(400).json({
        message: "No recipe exists !",
      });
    }

    res.status(200).json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// * `GET /api/recipes/:id` → Get details of a single recipe
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      res.status(400).send(`No recipe with id: ${id}`);
    }

    res.status(200).json(recipe);
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid id:${id} type !`,
        error: err,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// * `PATCH /api/recipes/:id` → Update recipe
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findByIdAndUpdate(id, req.body);

    if (!recipe) {
      return res.status(400).json({
        message: `No recipe with id:${id} exists !`,
      });
    }

    const updatedRecipe = await recipe.save();

    res.status(200).json({
      message: "Here's the updated Recipe: ",
      recipe: updatedRecipe,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid id:${id} type !`,
        error: err,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// `DELETE /api/recipes/:id` → Delete recipe
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findByIdAndDelete(id);

    if (recipe.length === 0) {
      return res.status(400).json({
        message: `No recipe with id:${id} !`,
      });
    }

    res.status(200).json({
      message: `Recipe with id:${id} successfully deleted !`,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid id:${id} type !`,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

module.exports = router;
