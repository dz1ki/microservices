"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("companies", [
      {
        name: "KFC",
        address: "174 Sydenham Rd, London SE26 5JZ",
        scope: "FastFood",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "mcDoner",
        address: "Worsley Bridge Rd, London SE26 5BZ",
        scope: "FastFood",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "mcDonalds",
        address: "130 High St, London SE20 7EZ",
        scope: "FastFood",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Evroopt",
        address: "137 Sydenham Rd, London SE26 5HB",
        scope: "Shop",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Belamarket",
        address: "Bromley Hill, Bromley BR1 4JD",
        scope: "Shop",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("companies", null, {});
  },
};
