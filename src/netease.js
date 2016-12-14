const Crypto = require('./crypto');
const fetch = require('node-fetch');
const querystring = require('querystring');
const NETEASE_API_URL = 'http://music.163.com/weapi';

const NeteaseRequest = (url, query) => {
  let opts = {
    method: 'POST',
    headers: {
      'Origin': 'http://music.163.com',
      'Referer': 'http://music.163.com',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  opts.body = querystring.stringify(query);
  return new Promise((resolve, reject) => {
    fetch(NETEASE_API_URL + url, opts)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  });
}

/*
 *  查询
 *  type - 搜索单曲(1)，歌手(100)，专辑(10)，歌单(1000)，用户(1002)
 */

const searchSong = (key, limit, page) => {
  let obj = {
    s: key,
    type: 1,
    limit: limit,
    offset: (page - 1)*limit,
  };
  let encData = Crypto.aesRsaEncrypt(JSON.stringify(obj));
  return NeteaseRequest(`/cloudsearch/get/web?csrf_token=`, encData);
}

const searchPlaylist = (key, limit, page) => {
  let obj = {
    s: key,
    type: 1000,
    limit: limit,
    offset: (page - 1)*limit,
  };
  let encData = Crypto.aesRsaEncrypt(JSON.stringify(obj));
  return NeteaseRequest(`/cloudsearch/get/web?csrf_token=`, encData);
}

const searchAlbum = (key, limit, page) => {
  let obj = {
    s: key,
    type: 10,
    limit: limit,
    offset: (page - 1)*limit,
  };
  let encData = Crypto.aesRsaEncrypt(JSON.stringify(obj));
  return NeteaseRequest(`/cloudsearch/get/web?csrf_token=`, encData);
}

const getSong = (id) => {
  id = id.split('.').map(i => parseInt(i));
  let obj = {
    'ids': id,
    'br': 999000,
    'csrf_token': ''
  };
  let encData = Crypto.aesRsaEncrypt(JSON.stringify(obj));
  return NeteaseRequest(`/song/enhance/player/url?csrf_token=`, encData);
}

const getAlbumDetail = (id) => {
  let obj = {
    'csrf_token': '',
  };
  let encData = Crypto.aesRsaEncrypt(JSON.stringify(obj));
  return NeteaseRequest(`/v1/album/${id}?csrf_token=`, encData);
}

const getPlaylistDetail = (id) => {
  let obj = {
    id,
    n: 1000,
    'csrf_token': '',
  };
  let encData = Crypto.aesRsaEncrypt(JSON.stringify(obj));
  return NeteaseRequest(`/v3/playlist/detail?csrf_token=`, encData);
}

module.exports = {
  searchSong,
  searchPlaylist,
  searchAlbum,
  getSong,
  getAlbumDetail,
  getPlaylistDetail,
};
