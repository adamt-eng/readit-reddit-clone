import User from '../Models/UserModel.js';

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password'); // Exclude password field
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
}




