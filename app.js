var express     = require("express"),
	 app        = express(),
     bodyParser = require("body-parser"),
 	 mongoose   = require("mongoose");	

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

//Schema Setup
var campgroundShema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model("Campground", campgroundShema);

// Campground.create({
// 	 name: "Pierty",
//      image:"https://farm8.staticflickr.com/7338/9627572189_12dbd88ebe.jpg"
	
// }, function(err, campground){
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log("Newly Created Campground: ");
// 		console.log(campgrounds);
// 	}
// });

app.get("/", function(req, res){
    res.render("landing"); 
});

//INDEX - show all campground
app.get("/campgrounds", function(req, res){
	// Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("index", {campgrounds : allCampgrounds});	
		}
	});
});

//CREATE - add new campground to db
app.post("/campgrounds", function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
	var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    //campgrounds.push(newCampground);
	//Create a new cmpground and save to DB
	Campground.create(newCampground,function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	}); 
});

//New - show form to create new campground
app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs");
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req,res){
	//find the campground with provided ID
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//render show template with that campground
			res.render("show", {campground: foundCampground});
		}
	});
	
});

app.listen(3000,() => {
	console.log('server is listening on port 3000');
});
