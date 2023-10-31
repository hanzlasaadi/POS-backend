class APIFeatures {
  constructor(query, reqQueryObj) {
    this.query = query;
    this.reqQueryObj = reqQueryObj;
  }

  filter() {
    // 1A) Making the query[only filtering allowed queries];
    const excludedQueries = ['page', 'sort', 'fields', 'limit'];
    const queryObj = { ...this.reqQueryObj };
    excludedQueries.forEach((el) => delete queryObj[el]);

    // 1B) Advanced query filtering
    // const query = Tour.find({ difficulty: 'easy', duration: { $gte: '5' } }); [OLD]
    let advQuery = JSON.stringify(queryObj);
    advQuery = advQuery.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(advQuery));

    this.query = this.query.find(JSON.parse(advQuery));

    return this;
  }

  sort() {
    // 2) Sorting
    if (this.reqQueryObj.sort) {
      const manyQueries = this.reqQueryObj.sort.split(',').join(' ');
      this.query = this.query.sort(manyQueries);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    // 3) Limiting Fields in the Results
    if (this.reqQueryObj.fields) {
      const fields = this.reqQueryObj.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // 4) Pagination
    const page = +this.reqQueryObj.page || 1;
    const limit = +this.reqQueryObj.limit || 5;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
