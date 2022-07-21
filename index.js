const express = require('express');
const cors = require('cors')
const app = express();
// const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
// const indexPath  = path.resolve(__dirname, '..', 'build', 'index.html');
const {getPostById} = require('./posts')
// static resources should just be served as they are
// app.use(express.static(
//     path.resolve(__dirname, '..', 'build'),
//     { maxAge: '30d' },
// ));
const path = __dirname + '/views/'
const indexPath  = path + "index.html"
app.use(cors())
app.use(express.static(path));
app.get('/*', (req, res, next) => {
    fs.readFile(indexPath, 'utf8', (err, htmlData) => {
        if (err) {
            console.error('Error during file reading', err);
            return res.status(404).end()
        }
        // get post info
        const postId = req.query.id;
        console.log(postId)
        const post = getPostById(postId);
        if(!post) return res.status(404).send("Post not found");

        // inject meta tags
        htmlData = htmlData.replace(
            "<title>React App</title>",
            `<title>${post.title}</title>`
        )
        .replace('__META_OG_TITLE__', post.title)
        .replace('__META_OG_DESCRIPTION__', post.description)
        .replace('__META_DESCRIPTION__', post.description)
        .replace('__META_OG_IMAGE__', post.thumbnail)
        return res.send(htmlData);
    });
});
app.listen(PORT, (error) => {
    if (error) {
        return console.log('Error during app startup', error);
    }
    console.log("listening on " + PORT + "...");
});