/*! random-movie-trailer 2017-10-17 */

const compression=require("compression"),express=require("express"),app=express(),exphbs=require("express-handlebars");var cookieParser=require("cookie-parser"),port=process.env.PORT||3e3,path=require("path"),routes=require(path.join(__dirname,"controllers/routes")),debug="test"!=process.env.NODE_ENV;app.use(compression());const publicFolder=path.join(__dirname,"public/");app.use(express.static(publicFolder)),app.use(cookieParser()),app.use("/",routes);const viewsPath=path.join(__dirname,"views/");app.set("views",viewsPath),app.engine("handlebars",exphbs({defaultLayout:"main",layoutsDir:viewsPath+"/layouts"})),app.set("view engine","handlebars"),app.listen(port,function(){debug&&console.log("Server Starts on "+port)}),module.exports=app;