/*
  TODO:
    1) check wall posts of friends
    2) check wall posts of target's groups subscribes
    3) check videos of friends (may be)
*/

var request = require('request');
var config = require('./config.js');

var toBeChecked = []; // VK media objects

var req = function(name, params, cb) {
  //https://api.vk.com/method/METHOD_NAME?PARAMETERS&access_token=ACCESS_TOKEN&v=V
  var params_url = "";
  for(element in params) { params_url += element + "=" + params[element] + "&"; }
  const url = "https://api.vk.com/method/" + name + "?&access_token=" + config.token + "&v=5.103&" + params_url;

  request.get({url: url}, function(err,httpResponse,body) {
    const res = JSON.parse(body);
    if(res["error"]) {
      if(config.show_vk_errors) console.log(res["error"]);
    } else {
      cb(res);
    }
  });
}

var sendLog = function(msg) {
  //req("messages.send", { user_id: log_id, random_id: Date.now(), message: msg }, function(res) { console.log(msg) });
  console.log(msg);
}

var isLastLogAboutEnd = false;
var check = function() {
  object = toBeChecked.pop();

  if(object) {
    req("likes.isLiked", { type: object["type"], user_id: config.target_id, owner_id: object["owner_id"], item_id: object["id"] }, function(res) {
      if(res["response"]["liked"] == 1) sendLog("vk.com/" + object["type"] + object["owner_id"] + "_" + object["id"]);

      isLastLogAboutEnd = false;
    });
  }

  if(!object && toBeChecked.length == 0 && !isLastLogAboutEnd) {
    sendLog("Reached 0 items");
    isLastLogAboutEnd = true;
  }
}

var setToBeChecked = function(res) {
  for(item of res["response"]["items"]) {
    item["type"] = "photo"; // to be changed further for ability of checking all types
    toBeChecked.push(item);
  }
}

req("friends.get", { user_id: config.target_id, count: 5000 }, function(res) {
  for(var i = 0; i < res["response"]["count"]; i++) {
    const friend_id = res["response"]["items"][i];

    setTimeout(req, config.getphoto_interval * i, "photos.getAll", { owner_id: friend_id, count: 200 }, setToBeChecked);
  }

  setInterval(check, config.check_interval);
});

sendLog("Started stalkering vk.com/id" + config.target_id + "\nIt may takes a while, chill out\nReached 0 items at start is normal :)");
