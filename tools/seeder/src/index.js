const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const url = `mongodb://${process.env.MAIN_DB_USERNAME}:${process.env.MAIN_DB_PWD}@maindb:27017`;

const roles = [
  { name: 'administrator' },
  { name: 'agent' },
  { name: 'customer' },
];
const predefinedAdmin = { username: 'administrator', canUseAI: true };

const predefinedAgents = [
  { firstName: 'Emma', lastName: 'Smith' },
  { firstName: 'Oliver', lastName: 'Johnson' },
  { firstName: 'Ava', lastName: 'Brown' },
  { firstName: 'Liam', lastName: 'Davis' },
  { firstName: 'Sophia', lastName: 'Garcia' },
  { firstName: 'Ethan', lastName: 'Martinez' },
  { firstName: 'Isabella', lastName: 'Anderson' },
  { firstName: 'Lucas', lastName: 'Hernandez' },
  { firstName: 'Mia', lastName: 'Lopez' },
  { firstName: 'Noah', lastName: 'Wilson' },
];

const predefinedCustomers = [
  { firstName: 'Abigail', lastName: 'Jones' },
  { firstName: 'William', lastName: 'Mitchell' },
  { firstName: 'Samantha', lastName: 'Davis' },
  { firstName: 'Christopher', lastName: 'Carter' },
  { firstName: 'Olivia', lastName: 'Reynolds' },
  { firstName: 'Emma', lastName: 'Walker' },
  { firstName: 'Benjamin', lastName: 'Turner' },
  { firstName: 'Mia', lastName: 'Roberts' },
  { firstName: 'Elijah', lastName: 'Parker' },
  { firstName: 'Grace', lastName: 'Miller' },
  { firstName: 'Samuel', lastName: 'White' },
  { firstName: 'Ava', lastName: 'Harris' },
  { firstName: 'Henry', lastName: 'King' },
  { firstName: 'Lily', lastName: 'Carter' },
  { firstName: 'Daniel', lastName: 'Foster' },
  { firstName: 'Harper', lastName: 'Adams' },
  { firstName: 'Mason', lastName: 'Bennett' },
  { firstName: 'Chloe', lastName: 'Scott' },
  { firstName: 'Logan', lastName: 'Green' },
  { firstName: 'Sofia', lastName: 'Wright' },
  { firstName: 'Jackson', lastName: 'Hall' },
  { firstName: 'Scarlett', lastName: 'Taylor' },
  { firstName: 'Liam', lastName: 'Murphy' },
  { firstName: 'Zoey', lastName: 'Lewis' },
  { firstName: 'Caleb', lastName: 'Clark' },
];

async function main() {
  let client = null;
  try {
    client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    console.log('Failed to connect:', e);
    process.exit(1);
  }

  const db = client.db('sts_db');

  async function seedPredefinedUsers() {
    const predefinedUsers = [predefinedAdmin].map(({ username, canUseAI }) => ({
      username,
      firstName: capitalizeFirstLetter(username),
      lastName: capitalizeFirstLetter(username),
      passwordHash: bcrypt.hashSync(username, 10),
      canUseAI: canUseAI || false,
      role: 'administrator',
      status: 'ACTIVE',
    }));

    try {
      await db.collection('users').drop();
      console.log(`Dropped documents from users collection`);
    } catch (e) {
      console.log('Error dropping users:', e);
    }

    try {
      const result = await db.collection('users').insertMany(predefinedUsers);
      adminIds = result.insertedIds;
      console.log(
        `Inserted ${result.insertedCount} users (admin and superadmin).`,
      );
    } catch (e) {
      console.log('Failed to insert users', e);
    }
  }

  let agentIds = null;

  async function seedPredefinedAgents() {
    try {
      const agents = predefinedAgents.map(({ firstName, lastName }) => ({
        username: firstName.toLowerCase(),
        firstName,
        lastName,
        canUseAI: false,
        passwordHash: bcrypt.hashSync(firstName.toLowerCase(), 10),
        role: 'agent',
        status: 'ACTIVE',
      }));

      const result = await db.collection('users').insertMany(agents);
      agentIds = result.insertedIds;
      console.log(`Inserted ${result.insertedCount} agents`);
    } catch (e) {
      console.log(`Failed to insert agents`, e);
    }
  }

  async function seedPredefinedCustomers() {
    try {
      const customers = predefinedCustomers.map(({ firstName, lastName }) => ({
        username: firstName.toLowerCase(),
        firstName,
        lastName,
        passwordHash: bcrypt.hashSync(firstName.toLowerCase(), 10),
        role: 'customer',
        status: 'ACTIVE',
      }));

      const result = await db.collection('users').insertMany(customers);
      agentIds = result.insertedIds;
      console.log(`Inserted ${result.insertedCount} customers`);
    } catch (e) {
      console.log(`Failed to insert customers`, e);
    }
  }

  await seedPredefinedUsers();
  await seedPredefinedAgents();
  await seedPredefinedCustomers();

  process.exit(0);
}

main();
