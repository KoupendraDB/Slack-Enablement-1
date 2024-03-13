const express = require("express");
const savingsHelper = require('./helpers/savings');

const app = express();
const port: number = 3000;

app.use(express.json());

interface User {
    user_id: number,
    name: string,
    income: number,
    expense: number,
    savings: number
}

let users: Array<User> = new Array<User>();

app.get("/user/:user_id", (req: any, res: any) => {
    let user_id: number = Number(req.params.user_id);
    let user: any = users.find((user) => {
        return user.user_id === user_id;
    });
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

app.post("/user", (req: any, res: any) => {
    let new_user: User = req.body;
    let user: any = users.find((user) => {
        return user.user_id === new_user.user_id;
    });
    if (user) {
        res.status(400).json({
            success: false
        });
    } else {
        new_user.savings = savingsHelper.savings(new_user.income, new_user.expense);
        users.push(new_user);
        res.status(200).json({
            success: true
        });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
});
