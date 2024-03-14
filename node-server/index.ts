const express = require("express");
import { MongoClient } from 'mongodb';
import { createClient } from 'redis';

const savingsHelper = require('./helpers/savings');

const app = express();
const port: number = 3000;

app.use(express.json());

let mongo_db_username: string = process.env.mongo_db_username!;
let mongo_db_password: string = process.env.mongo_db_password!;
let redis_password: string = process.env.redis_password!;

let uri: string = `mongodb+srv://${mongo_db_username}:${mongo_db_password}@cluster0.nff3sst.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const mongo_conn: any = MongoClient.connect(uri);

type User = {
    user_id: number,
    name: string,
    income: number,
    expense: number,
    savings: number
}

const redis_conn: any = createClient({
    password: redis_password,
    socket: {
        host: 'redis-12442.c309.us-east-2-1.ec2.cloud.redislabs.com',
        port: 12442
    }
});

(async () => {
    await redis_conn.connect();
    console.log('Redis connection established!');
})();


async function setCache(key: string, value: any) {
    await redis_conn.json.set(key, '$', value);
    await redis_conn.expire(key, 60);
}

async function getCache(key: string): Promise<any> {
    let data: any = await redis_conn.json.get(key);
    return data;
}

async function findOneFromMongo(dbName: string, collection: string, query: object, options: object = {}): Promise<any> {
    let mongo_client: any = await mongo_conn;
    let data = await mongo_client.db(dbName).collection(collection).findOne(query, options);
    return data;
}

async function fetchUser(userId: number): Promise<User> {
    let key = `user_id:${userId}`;
    let user: User = <User>(await getCache(key));
    if (user && user.user_id) {
        return user;
    }
    user = await findOneFromMongo('example', 'users', {user_id: userId}, {projection: {_id: 0}});
    if (user && user.user_id) {
        await setCache(key, user);
    }
    return user
}

// Routes
app.get("/user/:user_id", async (req: any, res: any) => {
    let user_id: number = Number(req.params.user_id);
    let user: User = await fetchUser(user_id);
    if (user) {
        res.status(200).json({
            success: true,
            user: user
        });
    } else {
        res.status(404).json({
            success: false
        });
    }
});

app.post("/user", async (req: any, res: any) => {
    let new_user: User = req.body;
    let user: User = await fetchUser(new_user.user_id);
    if (user) {
        res.status(409).json({
            success: false
        });
    } else {
        new_user.savings = savingsHelper.savings(new_user.income, new_user.expense);
        mongo_conn.then((client: any) => user = client.db('example').collection('users').insertOne(new_user));
        res.status(200).json({
            success: true
        });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
});
