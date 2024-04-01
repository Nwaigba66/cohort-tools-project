module.exports = (app)=>{

    app.use((req, res, next) => {
    res.status(404).json({message: "This route does not exitt!"});
    });

app.use((error, req, res, next) => {
    console.log("ERROR", req.method, req.path, error)
})
if(!res.headerSent){re.status(500).json({ message: "Internal server error"})
}
}
