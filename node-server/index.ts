const express = require("express");
const { MongoClient } = require('mongodb');

const savingsHelper = require('./helpers/savings');

const app = express();
const port: number = 3000;

app.use(express.json());

let mongo_db_username: string = process.env.mongo_db_username!;
let mongo_db_password: string = process.env.mongo_db_password!;

let uri: string = `mongodb+srv://${mongo_db_username}:${mongo_db_password}@cluster0.nff3sst.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

var conn: any = MongoClient.connect(uri);

interface User {
    user_id: number,
    name: string,
    income: number,
    expense: number,
    savings: number
}

app.get("/user/:user_id", (req: any, res: any) => {
    let user_id: number = Number(req.params.user_id);
    conn.then((client: any) => {
        client.db('example').collection('users').findOne({user_id: user_id}, {'_id': 0}).then((user: User) => {
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
        }).
        catch(() => {
                res.status(404).json({
                    success: false
                });
            }
        );
    }).
    catch(() => {
        res.status(404).json({
            success: false
        });
    });
});

app.post("/user", async (req: any, res: any) => {
    let new_user: User = req.body;
    conn.then((client: any) => {
        client.db('example').collection('users').findOne({user_id: new_user.user_id}).then((user: User) => {
            if (user) {
                res.status(409).json({
                    success: false
                });
            } else {
                new_user.savings = savingsHelper.savings(new_user.income, new_user.expense);
                conn.then((client: any) => user = client.db('example').collection('users').insertOne(new_user));
                res.status(200).json({
                    success: true
                });
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
});
