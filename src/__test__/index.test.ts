import supertest from "supertest";
import app from "../app";
import mongoose from "mongoose";
import { PORT } from "../index";
import dotenv from "dotenv";

dotenv.config();
const request = supertest(app);

const inValidData = {
  name: "",
};

describe("test environment", () => {
  beforeAll((done) => {
    mongoose
      .connect(process.env.MDB_URL_TEST!, { useNewUrlParser: true })
      .then(() => {
        console.log("Connected to Atlas");
        done();
      });
  });

  let destId = "";

  const validData = {
    name: "Kostas",
    description: "blabla",
    maxGuests: 5,
    location: "",
  };
  it("should be that true is true", () => {
    expect(true).toBe(true);
  });
  //   GET /accommodation
  //     will return the full list of accommodation

  it("It should test if get/accommodation returns an array", async () => {
    const response = await request.get("/accommodation");
    expect(response.status).toBe(200);
    console.log("response.body:", response.body);
    expect(response.body.length).toBe(0);
  });

  // POST /accommodation
  //     will add a new accommodation
  //     400 if invalid data

  it("It should test if Post /accommodation adds properly and checks if returns 400 for invalid data", async () => {
    const response = await request.post("/accommodation").send(inValidData);
    expect(response.status).toBe(400);
  });

  // GET /accommodation/:id

  //     returns an existing accommodation
  //     404 if not existing

  it("It should test if get/accommodation/:id  returns an existing acc or 404 if not", async () => {
    const dest = await request
      .post("/accommodation/destinations")
      .send({ location: "Greece" });
    destId = dest.body._id;
    const newAccResponse = await request
      .post("/accommodation")
      .send({ ...validData, location: destId });
    const id = newAccResponse.body._id;
    const response = await request.get("/accommodation/" + id);
    expect(response.status).toBe(200);
    const responseTwo = await request.get(
      "/accommodation/60e83cc10c4a7420ec8e8412"
    );
    expect(responseTwo.status).toBe(404);
  });
  // PUT /accommodation/:id
  //     will edit an existing accommodation
  //     204 ok
  //     404 if not existing
  it("It should test if put/accommodation/:id  returns an existing acc or 404 if not", async () => {
    const newAccResponse = await request
      .post("/accommodation")
      .send({ ...validData, location: destId });
    const id = newAccResponse.body._id;
    const response = await request
      .put("/accommodation/" + id)
      .send({ ...validData, location: destId, name: "Max" });
    expect(response.status).toBe(204);
    const responseTwo = await request.get(
      "/accommodation/60e83cc10c4a7420ec8e8412"
    );
    expect(responseTwo.status).toBe(404);
  });

  // DELETE /accommodation/:id

  //     will delete an existing accommodation
  //     204 if ok
  //     404 if not existing
  it("It should test if delete/accommodation/:id  deletes an existing acc or 404 if not", async () => {
    const newAccResponse = await request
      .post("/accommodation")
      .send({ ...validData, location: destId });
    const id = newAccResponse.body._id;
    const response = await request.delete("/accommodation/" + id);
    expect(response.status).toBe(204);
    const responseTwo = await request.get("/accommodation/" + id);
    expect(responseTwo.status).toBe(404);
  });
  // GET /destinations
  //     will return the list of all available locations where there is an accommodation; i.e. the list of cities, without duplicates
  // /accommodation/destinations
  // [] locations db.demo567.find({Name:{$in:["Chris","Bob"]}}, {Age:0,_id:0},{unique: true});

  // filter for the location

  it("It should test if get/destinations returns an array", async () => {
    const acc1 = await request
      .post("/accommodation")
      .send({ ...validData, location: destId });
    const acc2 = await request
      .post("/accommodation")
      .send({ ...validData, location: destId });

    const response = await request.get("/accommodation/destinations");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  // GET /destinations/:id
  //     will return the list of accommodations for a specific city
  it("It should test if GET /destinations/:id returns an array", async () => {
    const dest = await request
      .post("/accommodation/destinations")
      .send({ location: "Berlin" });
    const anotherDestId = dest.body._id;
    const acc1 = await request
      .post("/accommodation")
      .send({ ...validData, location: destId });
    const acc2 = await request
      .post("/accommodation")
      .send({ ...validData, location: destId });
    const acc3 = await request
      .post("/accommodation")
      .send({ ...validData, location: anotherDestId });
    const response = await request.get("/accommodation/destinations/" + destId);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(6);
  });

  afterAll((done) => {
    mongoose.connection.dropDatabase().then(() => {
      mongoose.connection.close().then(done);
      console.log("Disconnected");
    });
  });
});
