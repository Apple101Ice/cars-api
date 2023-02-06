let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
const port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

const { carsData } = require("./carsData");
const { carMaster, cars } = carsData;

app.get("/cars/carmaster", function (req, res) {
    res.send(carMaster);
});

app.get("/cars", function (req, res) {
    const minprice = req.query.minprice;
    const maxprice = req.query.maxprice;
    const fuel = req.query.fuel;
    const type = req.query.type;
    const sortby = req.query.sortby;
    let arr1 = cars;
    if (minprice)
        arr1 = arr1.filter(a1 => a1.price >= minprice);
    if (maxprice)
        arr1 = arr1.filter(a1 => a1.price <= maxprice);
    if (fuel)
        arr1 = arr1.filter(a1 => carMaster.find(m1 => m1.model === a1.model).fuel === fuel);
    if (type)
        arr1 = arr1.filter(a1 => carMaster.find(m1 => m1.model === a1.model).type === type);
    if (sortby)
        arr1.sort((c1, c2) => c1[sortby] - c2[sortby]);

    res.send(arr1);
});

app.get("/cars/:id", function (req, res) {
    let id = req.params.id;
    let index = cars.findIndex(c1 => c1.id === id);
    if (index >= 0)
        res.send(cars[index]);
    else
        res.status(404).send("No Customer found");
});

app.post("/cars", function (req, res) {
    let body = req.body;
    cars.push(body);
    res.send(body);
});

app.put("/cars/:id", function (req, res) {
    let id = req.params.id;
    let body = req.body;
    let index = cars.findIndex(c1 => c1.id === id);
    if (index >= 0) {
        let updatedCar = { id: id, ...body };
        cars[index] = updatedCar;
        res.send(cars);
    }
    else {
        res.status(404).send("No Car found");
    }
});

app.delete("/cars/:id", function (req, res) {
    let id = req.params.id;
    let index = cars.findIndex(c1 => c1.id === id);
    if (index >= 0) {
        cars.splice(index, 1);
        res.send(cars);
    }
    else {
        res.status(404).send("No Customer found");
    }
});