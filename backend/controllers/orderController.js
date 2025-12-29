import Order from '../models/orderModel.js';

// createOrder function remains the same 
export const createOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }
    const order = new Order({
      user: req.user._id,
      orderItems,
      totalPrice,
    });
    const createdOrder = await order.save();
    
    // Emit to a general 'admin' room
    const io = req.app.get('io');
    io.emit('new_order', createdOrder); // Send to all connected admins

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


//  GET CURRENT USER'S ORDERS 
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// NEW FUNCTION: GET ALL ORDERS (FOR ADMIN) 
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'username profilePic') 
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

//  UPDATE ORDER STATUS (Admin) 
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    const io = req.app.get('io');
    
    // Emit to the specific user's room
    io.to(`order_${order._id}`).emit('order_status_update', {
      orderId: order._id,
      status: order.status,
    });
    
    // Also emit to the general admin room so other admins see the change
    io.emit('admin_order_updated', order);

    res.status(200).json(order);
  } catch (error)
  {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};