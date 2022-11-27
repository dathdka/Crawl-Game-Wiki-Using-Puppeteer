const axios = require("axios");
const firebase = require("../../../firebase");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');
const { create } = require("domain");

const getName = (imgLink) =>{
  var arrSplit = imgLink.split('/')
  for(let i =0 ; i< arrSplit.length ; i++)
    if(arrSplit[i].includes('png'||'jpg'||'jpeg'))
      return arrSplit[i];
}

const fetchImage = (imgLink) =>
  new Promise(async (resolve, reject) => {
    await fetch(imgLink).then(async res =>{
      //TODO: save file by name
      var name = getName(imgLink);
      let createFile = fs.createWriteStream(`public/${name}`)
      res.body.pipe(createFile)
      createFile.on('finish',()=>{
        resolve(name)
      })
    })
  });

const imageHandler = async (item, imgLink) => {
  try {
    // upload local and remove instantly
    await fetchImage(imgLink).then(async name =>{
      await firebase.upload(`public/${name}`)
      fs.unlinkSync(`public/${name}`)
      item['image'] = name
    });
  } catch (error) {
    console.log('something went wrong')
    console.error(error);
  }
};
module.exports = imageHandler;
