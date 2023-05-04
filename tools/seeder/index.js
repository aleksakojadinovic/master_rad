const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


const url = `mongodb://${process.env.MAIN_DB_USERNAME}:${process.env.MAIN_DB_PWD}@maindb:27017`;

const roles = [
    { name: 'administrator' },
    { name: 'superadministrator' },
    { name: 'agent' },
    { name: 'customer' },
];
const predefinedAdmin = { username: 'administrator' }
const predefinedSuperAdmin = { username: 'superadministrator' }


// TODO: Eventually make a CLI for this seeder so not to overwrite everything every time
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
    { firstName: 'Noah', lastName: 'Wilson' }
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

    let roleIds = null;
    // Returns role ids
    async function seedRoles() {
        try {
            await db.collection('roles').drop();
            console.log(
                `Dropped documents from role collection`,
            );
        } catch (e) {
            console.log('Error dropping roles:', e);
        }
        let insertResult = null;
        try {
            insertResult = await db.collection('roles').insertMany(roles);
            console.log(`Inserted ${insertResult.insertedCount} roles`);
        } catch (e) {
            console.log('Error inserting roles:', roles);
        }
        roleIds = insertResult.insertedIds;
    }

    let adminIds = null;

    async function seedPredefinedUsers() {
        const predefinedUsers = [predefinedAdmin, predefinedSuperAdmin].map(({ username }) => ({
            username,
            firstName: capitalizeFirstLetter(username),
            lastName: capitalizeFirstLetter(username),
            passwordHash: bcrypt.hashSync(username, 10),
            roles: [roleIds[roles.map(({ name }) => name).indexOf(username)]]
        }));

        try {
            await db.collection('users').drop();
            console.log(
                `Dropped documents from users collection`,
            );
        } catch (e) {
            console.log('Error dropping users:', e);
        }

        try {
            const result = await db.collection('users').insertMany(predefinedUsers);
            adminIds = result.insertedIds;
            console.log(`Inserted ${result.insertedCount} users (admin and superadmin).`)
        } catch (e) {
            console.log('Failed to insert users', e);
        }
    }


    let agentIds = null;


    async function seedPredefinedAgents() {
        const agentRoleId = roleIds[roles.map(({ name }) => name).indexOf('agent')]
        try {
            const agents = predefinedAgents.map(({ firstName, lastName }) => ({
                username: firstName.toLowerCase(),
                firstName,
                lastName,
                passwordHash: bcrypt.hashSync(firstName.toLowerCase(), 10),
                roles: [agentRoleId]
            }));

            const result = await db.collection('users').insertMany(agents);
            agentIds = result.insertedIds;
            console.log(`Inserted ${result.insertedCount} agents`);

        } catch (e) {
            console.log(`Failed to insert agents`, e);
        }
    }

    await seedRoles();
    await seedPredefinedUsers();
    await seedPredefinedAgents();


    process.exit(0);
}

main();
