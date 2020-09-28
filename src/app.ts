import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import express from 'express'
import { Checkout } from './core/checkout'

const app = express();
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

const port = 3000;
dotenv.config({ path: './.env' })

const checkout = new Checkout()

app.get('/', (req, res) => {
  res.render('index', {addedItems: null, customer: null, total: null});
});

app.post('/add', async (req, res) => {
  const addedItems = await checkout.add(req.body)
  res.render('index', {addedItems, customer: req.body.retailer, total: null});
})

app.post('/total', (req, res) => {
  const {totalPrice, addedItems, customer} = checkout.total()
  res.render('index', {addedItems, customer, total: totalPrice});
})

app.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});
