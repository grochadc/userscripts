// ==UserScript==
// @name         YIFI linker for Letterboxd
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  Add links for YIFI (yts.am) torrent site on the watching services
// @author       Gonzalo Rocha
// @match        https://letterboxd.com/film/*
// @require https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    const filmName = document.querySelector('section#featured-film-header h1').innerText;
    const filmYear = document.querySelector('section#featured-film-header p small a').innerText;

    axios('https://yts.am/api/v2/list_movies.json?query_term='+filmName)
        .then(response => {
        let {movies} = response.data.data
        if(movies.length){
            let foundMovie = movies.filter(movie => movie.year == filmYear)[0];
            addService(foundMovie.url, 'YTS', foundMovie.torrents)
        }
    });


    const createEl = function (type, attrs, text){
        let el = window.document.createElement(type)
        Object.keys(attrs)
            .forEach(function (key){
            el.setAttribute(key,attrs[key])
        })
        if(text){
            let txt = window.document.createTextNode(text)
            el.appendChild(txt)
        }
        return el;
    }

    const addService = function(link, text, torrents) {
        let service = window.document.querySelector('.services')
        let p = window.document.createElement('p')
        let a = createEl('a', {
				href: link,
                target:'_blank',
				class: 'label'
        });
        let span = createEl('span', {class: 'name'}, text)
        a.appendChild(span)
        p.appendChild(a);

        torrents.forEach(torrent => {
            p.appendChild(createEl('a',{class: 'link track-event', target:'_blank', href:torrent.url}, torrent.quality))
        })
        service.appendChild(p);
        }
})();
