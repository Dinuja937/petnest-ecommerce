import Cart from '../models/Cart.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate(
            'items.product',
            'name image price stock'
        );

        if (cart) {
            res.json(cart);
        } else {
            res.json({ items: [] });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
    const { productId, name, image, price, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            const itemIndex = cart.items.findIndex(
                (item) => item.product.toString() === productId
            );

            if (itemIndex > -1) {

                cart.items[itemIndex].quantity += quantity || 1;
            } else {

                cart.items.push({ product: productId, name, image, price, quantity: quantity || 1 });
            }
        } else {

            cart = new Cart({
                user: req.user._id,
                items: [{ product: productId, name, image, price, quantity: quantity || 1 }],
            });
        }

        const savedCart = await cart.save();
        res.status(201).json(savedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItem = async (req, res) => {
    const { quantity } = req.body;

    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === req.params.productId
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            const updatedCart = await cart.save();
            res.json(updatedCart);
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== req.params.productId
        );

        const updatedCart = await cart.save();
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Clear all items from cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
