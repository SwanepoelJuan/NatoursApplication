const { query } = require('express');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utilities/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price'; 
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

exports.getAllTours = async (req, res) => { 
 
    try {
        const features = new APIFeatures(Tour, req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

        const tours = await features.queryModel;

        res
        .status(200)
        .json({
            status: 'success',
            results: tours.length, 
            data: { tours }
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
    
exports.getTour =  async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);

        res
        .status(200)
        .json({ 
            status: 'success',
            data: { 
                tour
            } 
        });
    }   
    catch(err) {
        res
        .status(400)
        .json({ 
            status: 'fail',
            message: 'Tour was not found'
        });
    }
};

exports.createTour = async (req, res) => { 

    try {
        const newTour = await Tour.create(req.body);
        
        res
        .status(201)
        .json({ 
            status: 'success',
            data: { 
                tour: newTour
            }
        });
    } 
    catch (err) {
        res
        .status(400)
        .json({
            status: 'fail',
            message: err
        }); 
    }; 
};

exports.updateTour = async (req,res) => { 

    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }); 
    
        res
        .status(200)
        .json({
            message:'success',
            data: { 
                tour
            }
        });
    }
    catch(err) {
        res
        .status(400)
        .json({
            status: 'fail',
            message:'Update was not successful'
        });
    }
};

exports.deleteTour = async (req, res) => { 
    
    try {
        await Tour.findByIdAndDelete(req.params.id); 

        res
        .status(204)
        .json({
            status: 'success',
            data: null
        });

    }
    catch(err) {
        res
        .status(400)
        .json({
            status: 'fail',
            message: err
        });
    }; 
};

//Aggregation pipeline for data analysis
exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            { 
                $match: {ratingsAverage: {$gte: 4.5} } 
            },
            { 
                $group: 
                { 
                    _id: { $toUpper: '$difficulty' }, 
                    numOfRating: { $sum: '$ratingsQuantity'},
                    numOfTours: { $sum: 1},
                    averageRating: { $avg: '$ratingsAverage'},
                    averagePrice: { $avg: '$price'},
                    minPrice: { $min: '$price'},
                    maxPrice: { $max: '$price'}
                }
            },
            {
                $sort: { averagePrice: 1 }
            }
            // {
            //     $match: { _id: {$ne: 'EASY'} }
            // }
        ]);

        res
        .status(200)
        .json({
            status: 'success', 
            results: stats.length,
            data: { 
                stats: stats 
            }
        }); 
    }
    catch (err) { 
        res
        .status(404)
        .json({
            status: 'fail', 
            message: err
        })
    }
}; 

exports.getMonthlyPlan = async (req, res) => {

    try {
        const year = req.params.year * 1; 

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            }, 
            {
                $match: {
                    startDates: { 
                        $gte: new Date(`${year}-01-01`),
                        $lt: new Date(`${year+1}-01-01`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' } ,
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name'}
                }
            },
            {
                $addFields:  {
                    month:  '$_id'
                }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { 
                    numTourStarts: -1
                }
            }
            // {
            //     $limit: 4
            // }
        ]);

        res
        .status(200)
        .json({
            status: 'success', 
            results: plan.length,
            data: {
                plan: plan
            }
        });
    }
    catch (err) {
        res
        .status(404)
        .json({
            status: 'fail', 
            message: err
        })
    }
}; 