"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("clients", [
      {
        first_name: "Johni",
        last_name: "Doel",
        email: "doel123@examples.com",
        company_id: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Oliver",
        last_name: "Williams",
        email: "will24@examples.com",
        company_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Gabriel",
        last_name: "Peters",
        email: "pete78@examples.com",
        company_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Oleg",
        last_name: "Gibson",
        email: "oleg23@examples.com",
        company_id: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Derek",
        last_name: "Jordan",
        email: "der@examples.com",
        company_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Christian",
        last_name: "Collins",
        email: "coll89@examples.com",
        company_id: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Iris",
        last_name: "Grant",
        email: "grant28@examples.com",
        company_id: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Ariel",
        last_name: "Davis",
        email: "davi89@examples.com",
        company_id: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Olga",
        last_name: "Sol",
        email: "sol89@examples.com",
        company_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Valery",
        last_name: "Joi",
        email: "valery65@examples.com",
        company_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Wendy",
        last_name: "Doel",
        email: "wendy45@examples.com",
        company_id: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("clients", null, {});
  },
};
