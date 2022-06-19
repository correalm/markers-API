import supertest from "supertest";
import setupApp from "../src/app.js";
import Marker from "../src/models/marker.js";

const app = setupApp(0);

describe("insert", () => {
  let connection;
  let markers;

  beforeAll(async () => {
    app.database.once("open", () => {
      console.log("Successful connection with DB");
    });
    markers = app.database.collection("markers");
  });

  afterAll(async () => {
    const collection = app.database.collection("markers");
    await collection.deleteMany({});
    return await app.database.close();
  });

  const mockMarker = {
    _id: "some-user-is",
    position: { lat: "-53,333", lng: "-09,78" },
  };
  const wrongMockMarker = {
    _id: "some-user-is",
    position: { lng: "-09,78" },
  };

  it("/GET should return a array and statusCode 200", async () => {
    jest.setTimeout(10000);
    const res = await supertest(app).get("/markers");
    const array = [];
    expect(res._body).toEqual(array);
    expect(res.statusCode).toEqual(200);
  });

  it("/GET:id should return statusCode 302 and new marker", async () => {
    const newMarker = await supertest(app)
      .post("/markers")
      .send({ position: { ...mockMarker.position } });
    const id = newMarker._body._id;

    const res = await supertest(app).get(`/markers/${id}`);
    expect(res.statusCode).toEqual(302);
    expect(res._body).toEqual(newMarker._body);
  });

  it("/GET:id wrong - should return statusCode 404 and message", async () => {
    const id = "62ad1238684a5401cb0181f5";
    const res = await supertest(app).get(`/markers/${id}`);
    expect(res.statusCode).toEqual(404);
    expect(res._body).toEqual({ message: "id not founded" });
  });

  it("/POST markers", async () => {
    const res = await supertest(app)
      .post("/markers")
      .send({ position: { ...mockMarker.position } });
    expect(res.statusCode).toEqual(201);
  });

  it("/POST wrong mockMarkers - should return an error and satusCode 400", async () => {
    const res = await supertest(app)
      .post("/markers")
      .send({ position: { ...wrongMockMarker.position } });

    expect(res._body).toEqual({
      err: "Marker validation failed: position.lat: Path `lat` is required.",
    });
    expect(res.statusCode).toEqual(400);
  });

  it("/PUT edit a marker - should return statusCode 201 and edited marker", async () => {
    const newMarker = await supertest(app)
      .post("/markers")
      .send({ position: { ...mockMarker.position } });

    const id = newMarker._body._id;

    const res = await supertest(app)
      .put(`/markers/${id}`)
      .send({ position: { lat: "1234", lng: "5678" } });

    expect(res.statusCode).toEqual(201);
    expect(res._body.position).toEqual({ lat: "1234", lng: "5678" });
  });

  it("/PUT wrong obj pass - should return a statusCode 400 and a error message", async () => {
    const newMarker = await supertest(app)
      .post("/markers")
      .send({ position: { ...mockMarker.position } });

    const id = newMarker._body._id;
    const res = await supertest(app).put(`/markers/${id}`).send({});
    expect(res._body).toEqual({ message: "need provide a position" });
    expect(res.statusCode).toEqual(400);
  });

  it("/DELETE - should return a status code 200", async () => {
    const newMarker = await supertest(app)
      .post("/markers")
      .send({ position: { ...mockMarker.position } });

    const id = newMarker._body._id;
    const res = await supertest(app).delete(`/markers/${id}`);
    expect(res.statusCode).toEqual(200);
  });

  it("/DELETE wrong - should return a status code 400 and error message", async () => {
    const id = "62ad1238684a5401cb0181f5";
    const res = await supertest(app).delete(`/markers/${id}`);
    expect(res.statusCode).toEqual(400);
    expect(res._body).toEqual({ message: "id not founded" });
  });

  it("/DELETE/deleteAll - should return a status code 200", async () => {
    for (let i = 0; i < 2; i++) {
      const newMarker = await supertest(app)
        .post("/markers")
        .send({ position: { ...mockMarker.position } });
    }
    const res = await supertest(app).delete(`/markers/deleteAll`);
    expect(res.statusCode).toEqual(200);
  });
});
