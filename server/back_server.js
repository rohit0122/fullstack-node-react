const express = require('express');
const cors = require('cors');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const sharp = require('sharp');
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoURL = 'mongodb+srv://rohit:FrCfQ6E1djNdwOkg@familytree.ew4pkul.mongodb.net/?retryWrites=true&w=majority';
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(mongoURL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
let dbCollection = null;
const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(
    fileUpload({
        limits: {
            fileSize: 10000000,
        },
        abortOnLimit: true,
    })
);
const photoUploadPath = __dirname + '/../../public/upload/';

app.post('/api/uploadImage', async (req, res) => {
    //console.log('reqdata', req.files);
    const randomNumber = new Date().getTime().toString().split("").reverse().join("").substring(0, 4);
    const image = req.files;

    //console.log('imageimage', image.primaryPhoto);return;
    // If no image submitted, exit
    //if (!image) return res.sendStatus(400);

    let responseObj = { statusCode: 200, status: 'success', message: 'Image updated successfully.', data: { primaryPhoto: '', spousePhoto: '' } };
    try {
        // Move the uploaded image to our upload folder
        if (image.primaryPhoto) {
            //console.log('inside primary');
            let imageName = "member_" + randomNumber + image.primaryPhoto.name;
            //image.primaryPhoto.mv(__dirname + '/../../public/upload/' + imageName);
            //console.log('image.primaryPhotoimage.primaryPhoto', image.primaryPhoto)
            await sharp(image.primaryPhoto.data)
                .resize(200, 200)
                .jpeg({ mozjpeg: true })
                .toFile(photoUploadPath + imageName)
                .then(data => {
                    responseObj.data.primaryPhoto = imageName;
                })
                .catch(err => {
                    //console.log('Primary image upload error')
                });

        }
        if (image.spousePhoto) {
            //console.log('inside spousePhoto');
            let imageName = "spouse_" + randomNumber + image.spousePhoto.name;
            //image.spousePhoto.mv(__dirname + '/../../public/upload/' + imageName);
            //responseObj.data.spousePhoto = imageName;
            await sharp(image.spousePhoto.data)
                .resize(200, 200)
                .jpeg({ mozjpeg: true })
                .toFile(photoUploadPath + imageName)
                .then(data => {
                    responseObj.data.spousePhoto = imageName;
                })
                .catch(err => {
                    console.log('Spouse image upload error')
                });
        }

    } catch (e) {
        responseObj = { statusCode: 200, status: 'danger', message: e.message };
    }

    // All good
    res.status(responseObj.statusCode).json(responseObj);

});

app.post('/api/member', (req, res) => {
    //  console.log('reqdata', req.body.data)

    const memberId = req.body.data.memberObj.id;
    const isNewEntry = req.body.data.isNewEntry;
    let backUpFileName = `./src/database/backup/${(new Date().getTime())}_memberInfo.json`;
    ////console.log('memberIdmemberIdmemberId', memberId)
    let responseObj = { statusCode: 200, status: 'success', message: 'Member updated successfully.', data: [] };
    try {
        var memberInfoObj = JSON.parse(fs.readFileSync('./src/database/memberInfo.json', 'utf8'));
        fs.writeFileSync(backUpFileName, JSON.stringify(memberInfoObj)); //back before add/edit

        let memberObj = Object.assign(req.body.data.memberObj, {});
        memberObj.dateUpdated = `${new Date().toDateString()}, ${new Date().toLocaleTimeString()}`;

        if (isNewEntry) {
            memberInfoObj.push(memberObj);
        } else if (null !== memberId) {
            //find member id and index to edit the record
            let memberIndex = memberInfoObj.findIndex((item) => item.id === memberId);
            ////console.log('memberIndexmemberIndexmemberIndexmemberIndex', memberIndex);
            memberInfoObj[memberIndex] = memberObj;
        }
        ////console.log('memberInfoObjmemberInfoObjmemberInfoObj', memberInfoObj)


        fs.writeFileSync('./src/database/memberInfo.json', JSON.stringify(memberInfoObj));
    } catch (e) {
        responseObj = { statusCode: 200, status: 'danger', message: e.message };
    }
    ////console.log('memberInfoObj', memberInfoObj);
    res.status(responseObj.statusCode).json(responseObj);
});

app.get('/api/member', async (req, res) => {
    let responseObj = { statusCode: 200, status: 'success', message: 'Member info fetched successfully.', data: [] };
    try {
        const dbObj = await connectDb();

        //var memberInfoObj = JSON.parse(fs.readFileSync('./src/database/memberInfo.json', 'utf8'));
        var memberInfoObj = await dbObj.find({}).toArray();
        responseObj.data = memberInfoObj;
    } catch (e) {
        responseObj = { statusCode: 200, status: 'danger', message: e.message };
    }
    //console.log('memberInfoObj', memberInfoObj);
    res.status(responseObj.statusCode).json(responseObj);
});


app.delete('/api/member/:id', (req, res) => {
    let responseObj = { statusCode: 200, status: 'danger', message: 'Member delete failed.', data: [] };
    let backUpFileName = `./src/database/backup/${(new Date().getTime())}_memberInfo.json`;
    ////console.log('req.params.id', req.params.id);
    if (!isNaN(parseInt(req.params.id))) {
        const memberId = parseInt(req.params.id);
        try {
            var memberInfoObj = JSON.parse(fs.readFileSync('./src/database/memberInfo.json', 'utf8'));
            fs.writeFileSync(backUpFileName, JSON.stringify(memberInfoObj)); //back before delete

            memberInfoObj = memberInfoObj.filter(item => item.id !== memberId);
            memberInfoObj = memberInfoObj.filter(item => item.parentId !== memberId);
            ////console.log('memberInfoObj==========================', memberInfoObj);
            fs.writeFileSync('./src/database/memberInfo.json', JSON.stringify(memberInfoObj));
            responseObj = { statusCode: 200, status: 'success', message: 'Member delete successfully.', data: [] };

        } catch (e) {
            responseObj.message = e.message;
        }
    }
    res.status(responseObj.statusCode).json(responseObj);

});

app.get('/api/test', async (req, res) => {
    try {
        const dbObj = await connectDb();
        console.log('Connected successfully to server');
    } catch (e) {
        console.log('Connected error ', e.message);
    }
    console.log('reqdata', req.body)
    res.json({ message: "Hello from server!" });
});


app.listen(3001, () => {
    console.log(`Server is running on port 3001.`);
});

async function connectDb() {
    try {
        if (dbCollection === null) {
            // Connect the client to the server	(optional starting in v4.7)
            await client.connect();
            // Send a ping to confirm a successful connection
            const db = client.db("sample_mflix");
            await db.command({ ping: 1 });

            dbCollection = db.collection('family_members');
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
        }
    } catch (e) {
        // Ensures that the client will close when you error
        console.log('Something went wrong MongoDB, ', e.message);
        dbCollection = null;
        await client.close();
    }
    finally {
        return dbCollection;

    }
}