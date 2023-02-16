const express = require('express');
//Express app

const path = require('path');

const db = require('./config');

const bodyParser = require('body-parser'); 

const port = parseInt(process.env.port) || 4000;

const app = express();
//router
const route = express.Router();

app.use(
    route,
    express.json,
    bodyParser.urlencoded({extended: false}),
)

route.get('/', (req,res)=> {
    res.status(200).sendFile(path.join(__dirname, './view/index.html'));
})

route.get('/users', (req,res)=> {
    const strQry = 
    `
    SELECT firstName,lastName, emailAdd, country
    FROM Users;

    `;

    //db
    db.query(strQry, (err, data) => {
        if(err) throw err;
        res.status(200).json({result:data});
    })
})

route.post('/register', bodyParser.json(), (req,res)=>{
    let detail = req.body;
    console.log(detail);
    //sql query 
    const strQty = 
    `
    INSERT INTO Users
    SET ?;
    `;

    db.query(strQty, [detail], (err)=> {
        if(err) {
            res.status(400).json({err});
        }else {
            res.status(200).json({msg:'A user record was saved'})
        }
    })
})

route.put('/Users/:userID', bodyParser.json(), (req,res)=>{
    let data = req.body;
    console.log(data);

    const strQty = 
    `
    UPDATE Users
    SET ?
    WHERE userID = ?;
    `;

    db.query(strQty, [data, req.params.userID], (err)=> {
        if(err) throw err; 
        res.status(200).json({msg:"Updated Successfully"});
    });
});


route.delete('/Users/:userID', bodyParser.json(), (req,res)=>{
    const strQty = 
    `
    DELETE FROM Users
    WHERE userID = ?;
    `;

    db.query(strQty, [req.params.userID], (err)=> {
        if(err) throw err; 
        res.status(200).json({msg:"Deleted Successfully"});
    });
});



route.patch('/login', bodyParser.json(), (req, res)=>{
    const {emailAdd, userPass} = req.body;
    const strQry =
    `
    SELECT firstName, lastName, emailAdd, userPass,
    country
    FROM Users
    WHERE emailAdd = '${emailAdd}';
    `;
    db.query(strQry, (err, data)=>{
        if(err) throw err;
        if((!data.length) || (data == null)) {
            res.status(401).json({err:
                "You provided a wrong email address"});
        }else {
            let {firstName, lastName} = data[0];
            if(userPass === data[0].userPass) {
                res.status(200).json({msg:
                    `Welcome back, ${firstName} ${lastName}`});
            }else {
                res.status(200).json({err:
                    `You provided a wrong password`});
            }
        }
    })
})


app.listen(port,()=>{
    console.log(`Server is running at ${port}`);
})

