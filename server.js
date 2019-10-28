let express = require("express");
let bodyparser = require("body-parser");
let morgan = require("morgan");
let uuidv4 = require('uuid/v4');

let app = express();
let jsonParser = bodyparser.json();

app.use(express.static('webpage'));
app.use(morgan('dev'));

app.listen("8080",() => {
	console.log("ya estoy corriendo perrillo enserio");
});

function findId(id) {
    let index = -1;
    posts.forEach((p, idx) => {
        if (p.id == id) {
            index = idx;
        }
    })
    return index;
}

let posts = [
{
		id: uuidv4(),
		title: "Titulo post prueba 1",
		content: "Contenido post prueba 1",
		author : "Autor post prueba 1",
		publishDate: new Date(2019, 8, 24)
}, 
{
		id: uuidv4(),
		title: "Titulo post prueba 2",
		content: "Contenido post prueba 2",
		author : "Autor post prueba 2",
		publishDate: new Date(2015, 7, 10)
}
]

//return all blogposts
app.get("/blog-posts", (req, res, next) => {
	res.statusMessage = "all posts showed succesfully";
	return res.status(200).json(posts);
});

//return blogpost by author
app.get("/blog-post?author=value", (req, res, next) => {
	let authorName = req.body.author;
	if(!authorName){
	 	res.statusMessages = "Author name is missing";
	 	return res.status(406).json({
	 		message : "Author name is missing",
	 		status : 406
	 	})
	}

	let returnedPosts = [];
	posts.foreach(post =>{
		if(post.authorName == authorName)
			returnedPosts.push(post);
	});

	if(returnedPosts.length == 0){
		res.statusMessage = "Author does not exist";
		return res.status(404).json({
			message : "Author does not exist",
			status : 404
		});
	}
	res.statusMessage = "Author was found";
	return res.status().json(returnedObject);
});

//add a new post
app.post("/blog-posts", jsonParser, (req, res, next) => {
	let title = req.body.title;
	let content = req.body.content;
	let author = req.body.author;
	let publishDate = req.body.publishDate;

	if(!title || !content || !author || !publishDate){
		res.statusMessage = "one of the fields is missing";
		return res.status(406).json({
			message : "one of the fields is missing",
			status : 406
		});
	}

	let id = uuid();
	let returnedPost = {
		id: id,
		title: title,
		content: content,
		author : author,
		publishDate: publishDate
	};

	posts.push(returnedPost);
	res.statusMessage = "post published succesfully";
	return res.status(201).json(returnedPost);
});

//delete a post
app.delete("/blog-posts/:id", (req, res, next) => {
	let reqId = req.params.id;
    let index = findId(reqId);
    if(index >= 0) {
        posts.splice(index,1);
        return res.status(200).json({message: "Post deleted succesfully", status: 200});
    } else {
        res.statusMessage = "Id does not exist";
        return res.status(404).json({message: "Id does not exist", status: 404});
    }
});

//edit a post
app.put("/blog-posts/:id", jsonParser, (req, res, next) => {
	let bodyId = req.body.id;
    let title = req.body.title;
    let content = req.body.content;
    let author = req.body.author;
    let date = req.body.publishDate;
    let paramsId = req.params.id;

    if (!bodyId) {
        res.statusMessage = "Missing id field in body";
        return res.status(406).json({message: "Missing id field in body", status: 406});
    }

    if (paramsId != bodyId) {
        res.statusMessage = "Body and params Id do not match";
        return res.status(409).json({message: "Body and params Id do not match", status: 409});
    }

    let index = findId(bodyId);
    if(index < 0) {
        res.statusMessage = "Id not found";
        return res.status(404).json({message: "Id not found", status: 404});
    }

    posts[index].title = title ? title : posts[index].title;
    posts[index].content = content ? content : posts[index].content;
    posts[index].author = author ? author : posts[index].author;
    posts[index].publishDate = date ? date : posts[index].publishDate;

    let updatedPost = posts[index];
    return res.status(202).json(updatedPost);
});