const jsdom = require('jsdom');
const fetch = require('node-fetch');
const funcy = require('funcy');

async function getRawHtml(url) {
  try {
    const html = await fetch(url).then( res => res.text());
    return html;
  } catch (err) {
    console.log(err);
  }
}

async function getAlbumList() {
  let html
  const albums = [];

  try {
    html = await getRawHtml('http://www.globalia.net/donlope/fz/notes/discography');
  } catch (err) {
    console.log(err)
    return;
  }

  const JSDOM = jsdom.JSDOM;

  const dom = new JSDOM(html);
  const window = dom.window;
  const document = window.document;

  const albumLinks = document.body.querySelectorAll('.album');

  albumLinks.forEach(link => {
    const album = {};
    
    albumRow = link.parentElement.parentElement;
    album.title = link.textContent;
    album.artist = albumRow.querySelector(':nth-child(2)').textContent;
    album.label = albumRow.querySelector(':nth-child(4)').textContent;
    album.format = albumRow.querySelector(':nth-child(3)').textContent;
    album.catalogNumber = albumRow.querySelector(':nth-child(5)').textContent;
    album.releaseDate = albumRow.querySelector(':nth-child(4)').textContent;
    albums.push(album);
  })

  return albums;
}

async function getSongList() {
  let html
  const songs = [];

  try {
    html = await getRawHtml('http://www.globalia.net/donlope/fz/songs');
  } catch (err) {
    console.log(err)
    return;
  }

  const JSDOM = jsdom.JSDOM;

  const dom = new JSDOM(html);
  const window = dom.window;
  const document = window.document;

  const songLinks = document.querySelectorAll('div > ul > li > a');

  songLinks.forEach(function(songLink){
    const song = {};

    song.title = songLink.textContent;
    songs.push(song);
  })

  return songs;
}
