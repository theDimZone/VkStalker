/*
  create same file with name "config.js" and configure it
*/

//https://oauth.vk.com/authorize?client_id=YOUR_APP_CLIENT_ID&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=friends,groups,wall,photos&response_type=token&v=5.52
exports.token = ""; // VK api token
exports.target_id = "1"; // user id to stalk

exports.getPhotoInterval = 2000;
exports.checkInterval = 650;
exports.show_vk_errors = false;
