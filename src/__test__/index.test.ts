import supertest from "supertest";
import app from "../app";
import mongoose from "mongoose";
import { PORT } from "../index";
import dotenv from "dotenv";
import { base64 } from "./../lib/helper";
import { newUser } from "../types/interfaces";
import { response } from "express";

dotenv.config();
const request = supertest(app);

describe("test environment", () => {
  beforeAll((done) => {
    mongoose
      .connect(process.env.MDB_URL_TEST!, { useNewUrlParser: true })
      .then(() => {
        console.log("Connected to Atlas");
        done();
      });
  });

  const inValidData = {
    name: "",
  };
  const accommodation = {
    name: "Kostas",
    description: "blabla",
    maxGuests: 5,
    location: "",
    owner: "",
  };
  const validUser = {
    name: "Max",
    email: "max@max.com",
    role: "guest",
    password: "1234",
  };
  let destId = "";
  let newUser: newUser = {
    _id: "",
    name: "",
    email: "",
    password: "",
    role: "guest",
  };
  let newOwner: newUser = {
    _id: "",
    name: "",
    email: "",
    password: "",
    role: "host",
  };
  let newOwner2: newUser = {
    _id: "",
    name: "",
    email: "",
    password: "",
    role: "host",
  };
  let aToken = "";
  let rToken = "";
  let aToken2 = "";
  let rToken2 = "";
  let aToken3 = "";
  let rToken3 = "";

  it("should be that true is true", () => {
    expect(true).toBe(true);
  });

  //Auth
  it("1) It should test if POST /user/register", async () => {
    const response = await request.post("/users/register").send(validUser);
    newUser = response.body;

    const response2 = await request.post("/users/register").send({
      ...validUser,
      role: "host",
      password: "1111",
      email: "owner1@owner.com",
    });
    newOwner = response2.body;

    const response3 = await request.post("/users/register").send({
      ...validUser,
      role: "host",
      password: "2222",
      email: "owner2@owner.com",
    });

    newOwner2 = response3.body;

    expect(response.status).toBe(201);
    expect(response2.status).toBe(201);
    expect(response3.status).toBe(201);
  });

  //login User
  it("2) It should test if GET /user/login the users are logged in", async () => {
    const response = await request
      .get("/users/login")
      .set(
        "authorization",
        `Basic ${base64([newUser.email, "1234"].join(":"))}`
      )
      .send();
    aToken = response.headers["set-cookie"][0].split(";")[0].split("=")[1];
    rToken = response.headers["set-cookie"][1].split(";")[0].split("=")[1];

    const response2 = await request
      .get("/users/login")
      .set(
        "authorization",
        `Basic ${base64([newOwner.email, "1111"].join(":"))}`
      )
      .send();
    aToken2 = response2.headers["set-cookie"][0].split(";")[0].split("=")[1];
    rToken2 = response2.headers["set-cookie"][1].split(";")[0].split("=")[1];
    const response3 = await request
      .get("/users/login")
      .set(
        "authorization",
        `Basic ${base64([newOwner2.email, "2222"].join(":"))}`
      )
      .send();
    aToken3 = response3.headers["set-cookie"][0].split(";")[0].split("=")[1];
    rToken3 = response3.headers["set-cookie"][1].split(";")[0].split("=")[1];
    expect(response.status).toBe(200);
    expect(response2.status).toBe(200);
    expect(response3.status).toBe(200);
  });
  //accommodations
  it("3) It should test if get/accommodation returns an array", async () => {
    const response = await request
      .get("/accommodation")
      .set("Cookie", [`access_token=${aToken}`, `refresh_token=${rToken}`])
      .send();
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);
  });
  it("It should test if Post /accommodation adds properly and checks if returns 400 for invalid data", async () => {
    const response = await request
      .post("/accommodation")
      .set("Cookie", [`access_token=${aToken2}`, `refresh_token=${rToken2}`])
      .send(inValidData);
    expect(response.status).toBe(400);
  });

  it("4) It should test if get/accommodation/:id  returns an existing acc or 404 if not", async () => {
    const dest = await request
      .post("/accommodation/destinations")
      .set("Cookie", [`access_token=${aToken2}`, `refresh_token=${rToken2}`])
      .send({ location: "Greece" });
    destId = dest.body._id;
    const newAccResponse = await request
      .post("/accommodation")
      .set("Cookie", [`access_token=${aToken3}`, `refresh_token=${rToken3}`])
      .send({ ...accommodation, location: destId, owner: newOwner2._id });

    const id = newAccResponse.body._id;

    const response = await request
      .get("/accommodation/" + id)
      .set("Cookie", [`access_token=${aToken2}`, `refresh_token=${rToken2}`])
      .send();

    expect(response.status).toBe(200);

    const responseTwo = await request
      .get("/accommodation/60e83cc10c4a7420ec8e8412")
      .set("Cookie", [`access_token=${aToken}`, `refresh_token=${rToken}`])
      .send();
    expect(responseTwo.status).toBe(404);
  });

  it("5) It should test if put/accommodation/:id  returns an existing acc or 404 if not", async () => {
    const newAccResponse = await request
      .post("/accommodation")
      .set("Cookie", [`access_token=${aToken2}`, `refresh_token=${rToken2}`])
      .send({ ...accommodation, location: destId, owner: newOwner._id });
    const id = newAccResponse.body._id;

    const response = await request
      .put("/accommodation/" + id)
      .set("Cookie", [`access_token=${aToken2}`, `refresh_token=${rToken2}`])
      .send({
        ...accommodation,
        location: destId,
        name: "Max",
        owner: newOwner._id,
      });

    expect(response.status).toBe(204);
    const responseTwo = await request
      .get("/accommodation/60e83cc10c4a7420ec8e8412")
      .set("Cookie", [`access_token=${aToken}`, `refresh_token=${rToken}`])
      .send();
    expect(responseTwo.status).toBe(404);
  });

  it("6) It should test if delete/accommodation/:id  deletes an existing acc or 404 if not", async () => {
    const newAccResponse = await request
      .post("/accommodation")
      .set("Cookie", [`access_token=${aToken2}`, `refresh_token=${rToken2}`])
      .send({ ...accommodation, location: destId, owner: newOwner._id });
    const id = newAccResponse.body._id;
    const response = await request
      .delete("/accommodation/" + id)
      .set("Cookie", [`access_token=${aToken2}`, `refresh_token=${rToken2}`])
      .send();
    expect(response.status).toBe(204);
    const responseTwo = await request
      .get("/accommodation/" + id)
      .set("Cookie", [`access_token=${aToken}`, `refresh_token=${rToken}`])
      .send();
    expect(responseTwo.status).toBe(404);
  });

  it("7) It should test if get/destinations returns an array", async () => {
    const acc1 = await request
      .post("/accommodation")
      .set("Cookie", [`access_token=${aToken2}`, `refresh_token=${rToken2}`])
      .send({ ...accommodation, location: destId, owner: newOwner2._id });
    const acc2 = await request
      .post("/accommodation")
      .set("Cookie", [`access_token=${aToken2}`, `refresh_token=${rToken2}`])
      .send()
      .send({ ...accommodation, location: destId, owner: newOwner2._id });

    const response = await request
      .get("/accommodation/destinations")
      .set("Cookie", [`access_token=${aToken}`, `refresh_token=${rToken}`])
      .send();
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it("8) It should test if GET /destinations/:id returns an array", async () => {
    const dest = await request
      .post("/accommodation/destinations")
      .set("Cookie", [`access_token=${aToken2}`, `refresh_token=${rToken2}`])
      .send({ location: "Berlin" });
    const anotherDestId = dest.body._id;
    const acc1 = await request
      .post("/accommodation")
      .set("Cookie", [`access_token=${aToken2}`, `refresh_token=${rToken2}`])
      .send({ ...accommodation, location: destId, owner: newOwner._id });
    const acc2 = await request
      .post("/accommodation")
      .set("Cookie", [`access_token=${aToken2}`, `refresh_token=${rToken2}`])
      .send({ ...accommodation, location: destId, owner: newOwner._id });
    const acc3 = await request
      .post("/accommodation")
      .set("Cookie", [`access_token=${aToken2}`, `refresh_token=${rToken2}`])
      .send({ ...accommodation, location: anotherDestId, owner: newOwner._id });
    const response = await request
      .get("/accommodation/destinations/" + destId)
      .set("Cookie", [`access_token=${aToken}`, `refresh_token=${rToken}`]);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(6);
  });

  it("9) It should test if GET /users/me returns me", async () => {
    const response = await request
      .get("/users/me")
      .set("Cookie", [`access_token=${aToken}`, `refresh_token=${rToken}`])
      .send();
    expect(response.status).toBe(200);
  });

  it("10) it should test if Get /users/me/accommodations returns only my accommodations", async () => {
    const response = await request
      .get("/users/me/accommodations")
      .set("Cookie", [`access_token=${aToken2}`, `refresh_token=${rToken2}`])
      .send();
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(4);
  });

  it("11) It should test if get /accommodations for standard users", async () => {
    const response = await request
      .get("/accommodation")
      .set("Cookie", [`access_token=${aToken}`, `refresh_token=${rToken}`])
      .send();
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(7);
  });

  it("12) It should test if not get /accommodations for strangers", async () => {
    const response = await request.get("/accommodation").send();
    expect(response.status).toBe(401);
  });

  it("13) It should test if not post /accommodation for standard users", async () => {
    const response = await request
      .post("/accommodation")
      .set("Cookie", [`access_token=${aToken}`, `refresh_token=${rToken}`])
      .send({ ...accommodation, location: destId, owner: newUser._id });
    expect(response.status).toBe(403);
  });

  afterAll((done) => {
    mongoose.connection.dropDatabase().then(() => {
      mongoose.connection.close().then(done);
      console.log("Disconnected");
    });
  });
});
