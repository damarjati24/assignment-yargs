const yargs = require("yargs");
const fs = require("fs");
const validator = require("validator");

// membuat folder data apabila tidak ada
const dirPath='./data';
if (!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath);
}

// membuat file contacts.json jika belum ada 
const dataPath='./data/contacts.json';
if (!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath,'[]','utf-8');
}
yargs.command({
    command:'add',
    describe:'add new contact',
    builder:{
        name: {
            describe:'Contact Name',
            demandOption: true,
            type:'string',
        },
        email: {
            describe:'Contact Email',
            demandOption: false,
            type:'string',
        },
        mobile: {
            describe:'Contact Mobile Phone Number',
            demandOption: true,
            type:'string',
        },
    },
    handler(argv){
        const contact = {
            name:argv.name,
            email:argv.email,
            mobile:argv.mobile,
        };
        const file = fs. readFileSync(dataPath, 'utf8');
        const contacts = JSON.parse(file);
        let success=true;
        if (contacts.find(existingContact => existingContact.name === contact.name)) {
            console.log("Error: Contact with this name already exists.");
            success=false;
        }
        
        if (contact.email && !validator.isEmail(contact.email)) {
            console.log ("Error: Invalid email")
            success=false;
        }

        if (!validator.isMobilePhone(contact.mobile, 'id-ID')) {
            console.log ("Error: Invalid number")
            success=false;
        } 
        if (success) {
            contacts.push(contact);
            fs.writeFileSync(dataPath, JSON.stringify(contacts));
        }

        console.log(contact);
    }, 
});

yargs.parse();



// const readline = require('readline');
// const validator = require('validator');
// const fs = require('fs');

// // mengubah function menjadi async/await
// async function getUserInfo() {
//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout 
//     });
    
//     function askQuestion(question, validatorFn, errorMessage) {
//         return new Promise((resolve) => {
//             rl.question(question, (answer) => {
//                 if (validatorFn == null || validatorFn(answer)) {
//                     resolve(answer);
//                 } else {
//                     console.log(errorMessage);
//                     resolve(askQuestion(question, validatorFn, errorMessage));
//                 }
//             });
//         });
//     }

//     // blok try ini untuk membantu mengelola kesalahan dan memastikan kode asinkron berjalan dengan baik
//     try {
//         const name = await askQuestion("What is your name? ", null, "Name: invalid, please insert your name again");
//         const number = await askQuestion("What is your PhoneNumber? ", (number) => validator.isMobilePhone(number, "id-ID"), 
//         "PhoneNumber: invalid, please insert your number again");
//         const email = await askQuestion("What is your email? ", (email) => validator.isEmail(email), 
//         "Email: invalid, please insert your email again");
//         console.log(`Name: ${name}\nPhoneNumber: ${number}\nEmail: ${email}`);
        
//                 const contact = {name,number,email};
//                 const file = fs. readFileSync('data/contacts.json', 'utf8');
//                 const contacts = JSON.parse(file);
//                 contacts.push(contact);
//                 fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
//                 console.log('Terimakasih sudah memasukkan data anda!');

//     } catch (error) {
//         console.error(`Error: ${error.message}`);
//     } finally {
//         rl.close();
//     }
// }

// module.exports = { getUserInfo };