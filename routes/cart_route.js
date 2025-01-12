const express = require('express');
const router = express.Router();
const { Cart, Product } = require('../models');
const { authenticateToken } = require('../middleware')

// Get all items in the cart for the authenticated user
router.get('/cart', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id
      const cartItems = await Cart.findAll({
        where: { register_id: userId },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price'],
          },
        ],
      });
      res.status(200).json(cartItems);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cart items.' });
    }
  });
  
  // Add an item to the cart
  router.post('/cart', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id
      const { product_id, quantity } = req.body

      // Check if product exists
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
      }
  
      // Check if the item is already in the cart
      const existingCartItem = await Cart.findOne({
        where: { register_id: userId, product_id },
      })
  
      if (existingCartItem) {
        // Update quantity if item already exists
        existingCartItem.quantity += quantity
        await existingCartItem.save()
        return res.status(200).json(existingCartItem)
      }
  
      // Add new item to the cart
      const newCartItem = await Cart.create({
        register_id: userId,
        product_id,
        quantity,
      })

      res.status(201).json({
        message: 'Produk berhasil masuk keranjang!',
        cart: newCartItem
      })
    } catch (error) {
      console.log('err :', error)
      res.status(500).json({ error: 'Failed to add item to cart.' })
    }
  })
  
  // Update the quantity of an item in the cart
  router.put('/cart/:id', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { quantity } = req.body;
  
      const cartItem = await Cart.findOne({
        where: { id, register_id: userId },
      });
  
      if (!cartItem) {
        return res.status(404).json({ error: 'Cart item not found.' });
      }
  
      cartItem.quantity = quantity;
      await cartItem.save();
      res.status(200).json(cartItem);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update cart item.' });
    }
  });
  
  // Remove an item from the cart
  router.delete('/cart/:id', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
  
      const cartItem = await Cart.findOne({
        where: { id, register_id: userId },
      });
  
      if (!cartItem) {
        return res.status(404).json({ error: 'Cart item not found.' });
      }
  
      await cartItem.destroy();
      res.status(200).json({ message: 'Cart item removed successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove cart item.' });
    }
  });
  
  module.exports = router