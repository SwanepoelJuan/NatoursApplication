const User = require('./../models/userModel')

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}); 

        res
        .status(200)
        .json({
            status: 'success',
            data: {
                users
            }
        });
    }
    catch(err) {
        res
        .status(400)
        .json({
            status: 'fail',
            message: 'User list could not be retrieved',
            data: {
                err
            }
        });
    }
}; 

exports.createUser = async (req, res) => {

    try {
        const newUser = await User.create(req.body);

        res
        .status(200)
        .json({
            status: 'success',
            message: 'New user could not be created',
            data: {
                user: newUser
            }
        });
    }
    catch(err) {
        res
        .status(400)
        .json({
            status: 'fail',
            message: err
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id); 

        res
        .status(200)
        .json({
            status: 'success',
            data: {
                user
            }
        });
    }
    catch(err) {
        res
        .status(400)
        .json({
            status: 'fail',
            message: err
        });
    }
    
}; 

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true, 
            runValidators: true
        }); 

        res
        .status(200)
        .json({
            status: 'success', 
            data: { user }
        });
    }
    catch(err) {
        res
        .status(404)
        .json({
            status: 'fail',
            message: err
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id, req.body); 

        res
        .status(204)
        .json({
            status: 'success', 
            data: null
        })
    }
    catch(err) {
        res
        .status(404)
        .json({
            status: 'fail',
            message: err
        })
    }
};