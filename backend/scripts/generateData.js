require("dotenv").config();

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const Customer = require("../models/Customer");
const Order = require("../models/Order");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    await Customer.deleteMany({});
    await Order.deleteMany({});

    const cities = [
      "Delhi",
      "Mumbai",
      "Chandigarh",
      "Pune",
      "Bangalore",
      "Hyderabad",
    ];

    const channels = [
      "WHATSAPP",
      "EMAIL",
      "SMS",
      "RCS",
    ];

    const tagsList = [
      "premium",
      "fashion",
      "beauty",
      "coffee",
      "electronics",
      "loyal",
      "vip",
      "discount_hunter",
    ];

    const customers = [];

    for (let i = 0; i < 500; i++) {
      const customer = await Customer.create({
        name: faker.person.fullName(),

        email:
          faker.internet.email(),

        phone:
          faker.phone.number(),

        city:
          faker.helpers.arrayElement(
            cities
          ),

        gender:
          faker.helpers.arrayElement([
            "MALE",
            "FEMALE",
          ]),

        age:
          faker.number.int({
            min: 18,
            max: 65,
          }),

        preferredChannel:
          faker.helpers.arrayElement(
            channels
          ),

        tags:
          faker.helpers.arrayElements(
            tagsList,
            faker.number.int({
              min: 1,
              max: 3,
            })
          ),

        totalSpent:
          faker.number.int({
            min: 1000,
            max: 100000,
          }),

        totalOrders:
          faker.number.int({
            min: 1,
            max: 20,
          }),

        lifetimeValue:
          faker.number.int({
            min: 1000,
            max: 200000,
          }),

        lastOrderDate:
          faker.date.past({
            years: 1,
          }),
      });

      customers.push(customer);
    }

    console.log(
      "500 customers created"
    );

    for (let i = 0; i < 2000; i++) {
      const customer =
        faker.helpers.arrayElement(
          customers
        );

      await Order.create({
        customerId:
          customer._id,

        orderAmount:
          faker.number.int({
            min: 500,
            max: 10000,
          }),

        category:
          faker.helpers.arrayElement([
            "Fashion",
            "Coffee",
            "Beauty",
            "Electronics",
          ]),

        channel:
          customer.preferredChannel,

        status:
          faker.helpers.arrayElement([
            "PLACED",
            "DELIVERED",
            "CANCELLED",
          ]),

        orderDate:
          faker.date.past({
            years: 1,
          }),
      });
    }

    console.log(
      "2000 orders created"
    );

    process.exit();
  })
  .catch(console.error);