const MongoClient = require('mongodb').MongoClient;
const LoremIpsum = require("lorem-ipsum").LoremIpsum;

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});


function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const url = `mongodb://${process.env.MAIN_DB_USERNAME}:${process.env.MAIN_DB_PWD}@maindb:27017`;

const MIN_TICKET_TITLE_LENGTH = 4;
const MAX_TICKET_TITLE_LENGTH = 10;

const MIN_TICKET_BODY_LENGTH = 40;
const MAX_TICKET_BODY_LENGTH = 200;

const MIN_COMMENTS = 2;
const MAX_COMMENTS = 7;

const MIN_COMMENT_LENGTH = 10;
const MAX_COMMENT_LENGTH = 30;

const MIN_STATUS_CHANGES = 1;
const MAX_STATUS_CHANGES = 4;

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomTicketTitleLength() {
    return getRandomInt(MIN_TICKET_TITLE_LENGTH, MAX_TICKET_TITLE_LENGTH);
}


function getRandomTicketBodyLength() {
    return getRandomInt(MIN_TICKET_BODY_LENGTH, MAX_TICKET_BODY_LENGTH);
}

function getRandomTicketCommentLength() {
    return getRandomInt(MIN_COMMENT_LENGTH, MAX_COMMENT_LENGTH);
}

function getRandomNumberOfComments() {
    return getRandomInt(MIN_COMMENTS, MAX_COMMENTS);
}

function getRandomNumberOfStatusChanges() {
    return getRandomInt(MIN_STATUS_CHANGES, MAX_STATUS_CHANGES);
}

function generateTicketTitle() {
    const length = getRandomTicketTitleLength();
    return capitalizeFirstLetter(lorem.generateWords(length));
}

function generateTicketBody() {
    const length = getRandomTicketBodyLength();
    return capitalizeFirstLetter(lorem.generateWords(length));
}

function generateComment() {
    const length = getRandomTicketCommentLength();
    return { body: capitalizeFirstLetter(lorem.generateWords(length)) };
}

function generateComments() {
    const length = getRandomNumberOfComments();
    return Array.from(Array(length)).map(generateComment);
}

function generateStatusChange() {
    return { status: getRandomInt(0, 2) };
}

function generateStatusChanges() {
    const length = getRandomNumberOfStatusChanges();
    return Array.from(Array(length)).map(generateStatusChange);
}

async function getRoles(db) {
    return await db.collection('roles').find().toArray();
}

async function getCustomers(db, customerRoleId) {
    const result = await db.collection('users').find({ roles: customerRoleId }).toArray();
    return result;
}

async function getAgents(db, adminRoleId) {
    const result = await db.collection('users').find({ roles: adminRoleId }).toArray();
    return result;
}



const NUMBER_OF_TICKETS = 10;

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

    const roles = await getRoles(db);

    const customerRoleId = roles.find(({ name }) => name === 'customer')._id;
    const agentRoleId = roles.find(({ name }) => name === 'agent')._id;

    const customers = await getCustomers(db, customerRoleId);
    const agents = await getAgents(db, agentRoleId);

    const tickets = []

    for (let i = 0; i < NUMBER_OF_TICKETS; i++) {
        const title = generateTicketTitle();
        const body = generateTicketBody();
        const createdBy = customers[Math.floor(Math.random() * customers.length)];
        const createdAt = new Date();

        const comments = generateComments();
        const statusChanges = generateStatusChanges();

        const status = statusChanges[statusChanges.length - 1].status;

        // const mixed = [...(comments.map((comment) => ({ ...comment, type: 'comment' }))), ...(statusChanges.map((statusChange) => ({ ...statusChange, type: 'statusChange' })))];
        const mixed = [...comments, ...statusChanges];
        mixed.sort(() => Math.random() - 0.5);
        const history = mixed.map((entry) => ({
            groupId: Math.floor(Math.random() * 1000),
            timestamp: new Date(),
            initiator: [...agents, createdBy][Math.floor(Math.random() * (customers.length + 1))]._id,
            note: '',
            entryType: entry.status ? 3 : 4,
            entry
        }));

        const ticket = {
            title, body, createdBy: createdBy._id, createdAt, status, history
        }
        tickets.push(ticket);

    }

    await db.collection('tickets').drop();

    console.log('Dropped tickets.');

    const result = await db.collection('tickets').insertMany(tickets);

    console.log(`Inserted ${result.insertedCount} tickets`)

    process.exit(0);
}

main();
