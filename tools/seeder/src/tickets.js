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
  await db.collection('tickets').drop();
  console.log('Dropped tickets.');

  const tickets = [];

  for (let i = 0; i < 1000; i++) {
    const createdBy = customers[Math.floor(Math.random() * customers.length)];
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];

    const ticket = {
      title: lorem.generateWords(5),
      body: lorem.generateParagraphs(1),
      createdAt: new Date(
        Date.now() -
          30 * 24 * 60 * 60 * 1000 +
          (i * 24 * 60 * 60 * 1000) / 1000,
      ),
      createdBy: createdBy._id,
      status: 'NEW',
      history: [],
    };

    const history = [
      {
        timestamp: new Date(ticket.createdAt),
        initiator: createdBy,
        type: 'CREATED',
        payload: {
          title: ticket.title,
          body: ticket.body,
          status: 'NEW',
        },
      },
      {
        timestamp: new Date(ticket.createdAt.getTime() + 60000),
        initiator: randomAgent,
        type: 'STATUS_CHANGED',
        payload: {
          status: 'OPEN',
        },
      },
      {
        timestamp: new Date(ticket.createdAt.getTime() + 120000),
        initiator: randomAgent,
        type: 'COMMENT_ADDED',
        payload: {
          body: lorem.generateParagraphs(1),
          commentId: uuid.v4(),
          isInternal: false,
        },
      },
      {
        timestamp: new Date(ticket.createdAt.getTime() + 180000),
        initiator: randomAgent,
        type: 'STATUS_CHANGED',
        payload: {
          status: 'IN_PROGRESS',
        },
      },
    ];

    for (let j = 0; j < 3; j++) {
      history.push({
        timestamp: new Date(ticket.createdAt.getTime() + (240000 + j * 60000)),
        initiator: randomAgent,
        type: 'COMMENT_ADDED',
        payload: {
          body: lorem.generateParagraphs(1),
          commentId: uuid.v4(),
          isInternal: false,
        },
      });
    }

    const finalStatus = Math.random() < 0.7 ? 'RESOLVED' : 'CLOSED';
    history.push({
      timestamp: new Date(ticket.createdAt.getTime() + 300000),
      initiator: randomAgent,
      type: 'STATUS_CHANGED',
      payload: {
        status: finalStatus,
      },
    });

    ticket.history = history;
    ticket.status = finalStatus;
    tickets.push(ticket);
  }

  await db.collection('tickets').insertMany(tickets);
  console.log(`Inserted ${tickets.length} tickets.`);

  await client.close();
}

main();
