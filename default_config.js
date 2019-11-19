/*
  create same file with name "config.js" and configure it
*/

//https://oauth.vk.com/authorize?client_id=YOUR_APP_CLIENT_ID&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=friends,groups,wall,photos,video&response_type=token&v=5.52
exports.token = ""; // VK api token
exports.target_id = "1"; // user id to stalk

exports.show_vk_errors = false;

exports.getphoto_interval = 2000;
exports.check_interval = 650;
exports.getwall_interval = 3000;
exports.getvideos_interval = 4000;

exports.wallposts_count = 1; // (per user)
//limit of wall.get is 5000 request per day
