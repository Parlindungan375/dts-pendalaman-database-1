import 'source-map-support/register'

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import connectDB from './connect';
import { Customer, CustomerType } from './mongoose';

const app = express();

connectDB();
const customerModel = new Customer();

// middlewares
app.use(express.json());
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).json({
    success: false,
    message: err.message
  })
})

// routes
//@route    POST /customers
//@desc     Create customers
app.post('/customers', async (req, res, next) => {
  try {
    if(req.body instanceof Array) {
      await customerModel.createMany(req.body)
    } else {
      await customerModel.create(req.body)
    }
  } catch (error) {
    next(error)
  }
});

//@routes   GET /customers
//@desc     Fetch all customers
app.get('/customers', async (req, res, next) => {
  let customers: CustomerType[];
  const limit = Number(req.query.limit) || 10;
  try {
    customers = await customerModel.getAll(limit)
  } catch (error) {
    return next(error)
  }

  return res.send(customers)
  
}); 

//@routes   GET /customers
//@desc     Fetch customers search by keyword
app.get('/customers/search', async (req, res, next) => {
  let customers: CustomerType[];
  const keyword = req.query.keyword ? {
    first_name: {
      $regex: req.query.keyword as string,
      $options: 'i'
    }
  } : {};
  
  try {
    customers = await customerModel.getByName(keyword)
  } catch (error) {
    return next(error)
  }

  return res.send(customers)
})

//@routes   GET /customers
//@desc     Fetch customers type
app.get('/customers/type/:type', async (req, res, next) => {
  let customers: CustomerType[];
  const type = req.params.type as string;

  try {
    customers = await customerModel.getByType(type)
  } catch (error) {
    return next(error)
  }

  return res.send(customers)
})

//@routes   GET /customers
//@desc     Fetch customers by state
app.get('/customers/state/:state', async (req, res, next) => {
  let customers: CustomerType[];
  const state = req.params.state as string;

  try {
    customers = await customerModel.getByState(state)
  } catch (error) {
    return next(error)
  }

  return res.send(customers)
})

//@routes   GET /customers
//@desc     Fetch customers request by parameter age
app.get('/customers/age/:age', async (req, res, next) => {
  let customers: CustomerType[];
  const age = req.params.age as string ? {
    age: {
      $regex: req.params.age as string,
      $options: '30<'
    }
  } : {};

  try {
    customers = await customerModel.getByAge(age)
  } catch (error) {
    return next(error)
  }

  return res.send(customers)
})


app.listen(4000, () => {
  console.log('App listen to port 4000');
});
