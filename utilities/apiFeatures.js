class APIFeatures {
    constructor(queryModel, query) { //model of any class, query is a JS object
        this.queryModel = queryModel;
        this.query = query;
    }

    filter() {
        // 1a Filtering
        const queryObject = {...this.query}; //If we create a new object in JS, the new variable refers to the same address of the actual object
        const excludedFields = ['page', 'sort', 'limit', 'fields']; 

        excludedFields.forEach(el => delete queryObject[el]);

        //1b) Advanced filtering
        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.queryModel = this.queryModel.find(JSON.parse(queryString)); //Tour.find().find()

        //console.log(`The filter functions yields: ${JSON.parse(queryString)}`);
        return this; 
    }

    sort() {
        if(this.query.sort) {
            const sortBy = this.query.sort.split(',').join(' ');
            this.queryModel = this.queryModel.sort(sortBy); //this is also a mongoose function
        }
        else {
            this.queryModel = this.queryModel.sort('duration');
        }
        return this;
    }

    limitFields() {
        if(this.query.fields) {
            const fields = this.query.fields.split(',').join(' '); 
            this.queryModel = this.queryModel.select(fields);
        }
        else {
            this.queryModel = this.queryModel.select('-__v');
        }

        return this; 
    }

    paginate() { 
        const page = this.query.page * 1 || 1;
        const limit = this.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.queryModel = this.queryModel.skip(skip).limit(limit);
        
        return this;
    }


}

module.exports = APIFeatures;