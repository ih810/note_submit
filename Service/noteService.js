//This file handles all the function of the instance of notes
//There are 4 types of functions, add, edit, delete and list.
//There should be 2 other methods: read and write
//All the function revolve around read and write

//Basic Setup
const fs = require("fs");
const express = require("express");

const app = express();
app.use(express.json());

//NoteService takes file path to storage as constructor
class NoteService {
  constructor(file) {
    this.file = file;
    this.notes = this.read();
  }

  //add function resolve an array of the user's notes
  add(note, user) {
    return new Promise((resolve, reject) => {
      this.notes
        .then((data) => {
          if (data[user] === undefined) {
            //if there is no existing note for user, create a new one
            data[user] = [note];
          } else {
            //if it exist, push the new note into array
            data[user].push(note);
          }
        })
        .then(()=>{
          this.write();
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  //edit function does not resolve any data, it edit the json instead
  edit(index, note, user) {
    return new Promise ((resolve, reject)=>{
      this.notes
      .then((data)=>{
        //change the targeted index of the note
        data[user][index] = note;
        //user filter to clear out <1 empty element> in the array
        data[user] = data[user].filter((a)=> a);
        resolve();
      })
      .catch((err)=>{
        reject(err)
      })
    })
  }

  //delete functino does not resolve any data
  delete(index, user) {
    return new Promise((resolve, reject)=>{
      this.notes
      .then((data)=>{
        //remove the targeted data
        data[user].splice(index, 1);
        //user filter to clear out <1 empty element> in the array
        data[user] = data[user].filter((a)=> a);
        //stringify the new note list for write file
        let stringify = JSON.stringify(data)
      })
      .then(()=>{
        this.write()
        resolve();
      })
      .catch((err)=>{
        reject(err)
      })
    })
  };
  
  //list function resolve an array of user's note list
  list(user) {
    return new Promise((resolve, reject) => {
      this.notes
        .then((data) => {
          if (data[user] === undefined) {
            return (data[user] = []);
          } else {
            console.log(data)
            resolve(data[user]);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  //=============================================//
  //=============================================//
  //=============================================//

  write() {
    return new Promise((resolve, reject) => {
      this.notes.then((data) => {
        let stringify = JSON.stringify(data);
        fs.writeFile(this.file, stringify, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(this.notes);
          }
        });
      });
    });
  }

  read() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.file, (err, data) => {
        if (err) {
          reject(err);
        } else {
          let results = JSON.parse(data);
          resolve(results);
        }
      });
    });
  }
}

module.exports = NoteService;
