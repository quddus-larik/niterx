const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const getPhonesCollection = require("./model/phones");

const app = express();

async function startServer() {
  const server = new ApolloServer({
    typeDefs: `
      type Color {
        name: String!
        hex: String!
        avaliable: Boolean!
        phone_img: String!
      }

      type Category {
        name: String!
      }

      type Phone {
        id: ID!
        mobile_name: String!
        category: Category!
        release_date: String!
        sim_support: String!
        dimensions: String!
        operating_system: String!
        phone_weight: Float!
        screen_size: String!
        screen_resolution: String!
        screen_type: String!
        screen_protection: String
        card_slots: String
        ram: String!
        internal_memory: String!
        processor: String!
        gpu: String!
        type: String!
        size: String!
        front_camera: String!
        back_camera: String!
        bluetooth: String!
        is_3G: Boolean!
        is_4G_LTE: Boolean!
        is_5G: Boolean!
        radio: Boolean!
        nfc: Boolean!
        phone_img: String!
        color: [Color!]!
        doc_id: Int!
        price: Float!
        qty: Int!
      }

      type Query {
        getPhone(doc_id: Int!): Phone
        getAllPhones: [Phone!]!
        getPhonesByCategory(categoryName: String!): [Phone!]!
      }
    `,
    resolvers: {
      Phone: {
        id: (parent) => parent._id,
      },

      Query: {
        getAllPhones: async () => {
          const collection = await getPhonesCollection();
          return await collection.find({}).toArray();
        },
        getPhone: async (_, { doc_id }) => {
          const collection = await getPhonesCollection();
          return await collection.findOne({ doc_id });
        },
        getPhonesByCategory: async (_, { categoryName }) => {
          const collection = await getPhonesCollection();
          return await collection
            .find({ "category.name": { $regex: new RegExp(categoryName, 'i') } })
            .toArray();
        },
      },
    },
  });

  await server.start();

  app.use(cors());
  app.use(express.json());

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => ({}),
    })
  );

  app.listen(4000, () => {
    console.log("🚀 Server ready at http://localhost:4000/graphql");
  });
}

startServer();