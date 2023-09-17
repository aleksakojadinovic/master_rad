const MongoClient = require('mongodb').MongoClient;
const LoremIpsum = require('lorem-ipsum').LoremIpsum;
const uuid = require('uuid');

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

const url = `mongodb://${process.env.MAIN_DB_USERNAME}:${process.env.MAIN_DB_PWD}@maindb:27017`;

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates random amount of miliseconds between 10 minutes and 1 hour
 */
function generateRandomDelay() {
  // Generate a random number between 0 and 1
  const randomFraction = Math.random();

  // Calculate the random time within the desired range
  const minMilliseconds = 600000; // 10 minutes
  const maxMilliseconds = 3600000; // 1 hour
  const randomMilliseconds =
    minMilliseconds + randomFraction * (maxMilliseconds - minMilliseconds);

  return randomMilliseconds;
}

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

  const customers = await db
    .collection('users')
    .find({ role: 'customer' })
    .toArray();
  const agents = await db.collection('users').find({ role: 'agent' }).toArray();

  // Drop existing tickets
  try {
    await db.collection('tickets').drop();
    console.log('Dropped tickets.');
  } catch (e) {}

  const tickets = [];

  for (let i = 0; i < 1000; i++) {
    const createdBy =
      customers[Math.floor(Math.random() * customers.length)]._id;
    const randomAgent = agents[Math.floor(Math.random() * agents.length)]._id;

    const increment = (30 * 24 * 60 * 60 * 1000) / 1000;
    const createdAt = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000 + i * increment,
    );

    const ticket = {
      title: capitalizeFirstLetter(lorem.generateWords(5)),
      body: capitalizeFirstLetter(lorem.generateParagraphs(1)),
      createdAt,
      createdBy: createdBy,
      status: 'NEW',
      history: [],
    };

    let currentTime = createdAt.getTime() + generateRandomDelay();

    const history = [];
    history.push({
      timestamp: new Date(currentTime),
      initiator: createdBy,
      type: 'CREATED',
      payload: {
        title: ticket.title,
        body: ticket.body,
        status: 'NEW',
      },
    });

    currentTime += generateRandomDelay();

    history.push({
      timestamp: new Date(currentTime),
      initiator: randomAgent,
      type: 'STATUS_CHANGED',
      payload: {
        status: 'OPEN',
      },
    });

    currentTime += generateRandomDelay();

    history.push({
      timestamp: new Date(currentTime),
      initiator: randomAgent,
      type: 'ASSIGNEES_CHANGED',
      payload: {
        assignees: [randomAgent],
      },
    });

    currentTime += generateRandomDelay();

    history.push({
      timestamp: new Date(currentTime),
      initiator: randomAgent,
      type: 'STATUS_CHANGED',
      payload: {
        status: 'IN_PROGRESS',
      },
    });

    for (let j = 0; j < 7; j++) {
      currentTime += generateRandomDelay();
      history.push({
        timestamp: new Date(currentTime),
        initiator: Math.random() < 0.5 ? randomAgent : createdBy,
        type: 'COMMENT_ADDED',
        payload: {
          body: lorem.generateParagraphs(1),
          commentId: uuid.v4(),
          isInternal: false,
        },
      });
    }

    const finalStatus = Math.random() < 0.7 ? 'RESOLVED' : 'CLOSED';

    currentTime += generateRandomDelay();

    history.push({
      timestamp: new Date(currentTime),
      initiator: randomAgent,
      type: 'STATUS_CHANGED',
      payload: {
        status: finalStatus,
      },
    });

    ticket.history = history;
    ticket.status = finalStatus;
    ticket.assignees = [randomAgent];
    tickets.push(ticket);
  }

  await db.collection('tickets').insertMany(tickets);
  console.log(`Inserted ${tickets.length} tickets.`);

  await client.close();
}

main();
