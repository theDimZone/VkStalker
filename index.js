/*
  TODO:
    1) check wall posts of target's groups subscribes
    vk limits wall.get to 5000 requests per day, so..... (100 friends * 100 groups = 10000 requests)
    we have to use Streaming API
*/

var request = require('request');
var config = require('./config.js');

var toBeChecked = []; // VK media objects

var req = function(name, params, cb) {
  //https://api.vk.com/method/METHOD_NAME?PARAMETERS&access_token=ACCESS_TOKEN&v=V
  var params_url = "";
  for(element in params) { params_url += element + "=" + params[element] + "&"; }
  const url = "https://api.vk.com/method/" + name + "?&access_token=" + config.token + "&v=5.103&" + params_url;

  request.get({url: url, timeout: 20000}, function(err,httpResponse,body) {
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
      if(res["response"]["liked"] == 1) sendLog("vk.com/id" + object["owner_id"] + " - vk.com/" + object["type"] + object["owner_id"] + "_" + object["id"]);

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
    if(item["post_type"]) {
      item["type"] = "post";
    } else if(item["duration"]) {
      item["type"] = "video";
    } else {
      item["type"] = "photo";
    }
    toBeChecked.push(item);
  }
}

console.log(config.check_interval);

req("friends.get", { user_id: config.target_id, count: 5000 }, function(res) {
  for(var i = 0; i < res["response"]["count"]; i++) {
    const friend_id = res["response"]["items"][i];

    setTimeout(req, config.getphoto_interval * i, "photos.getAll", { owner_id: friend_id, count: 200 }, setToBeChecked);
    setTimeout(req, config.getwall_interval * i, "wall.get", { owner_id: config.target_id, count: config.wallposts_count, filter: "owner", }, setToBeChecked);
    setTimeout(req, config.getvideos_interval * i, "video.get", { owner_id: config.target_id, count: 200 }, setToBeChecked);
  }

  setInterval(check, config.check_interval);
});

sendLog("Started stalkering vk.com/id" + config.target_id + "\nIt may takes a while, chill out\nReached 0 items at start is normal :)");
