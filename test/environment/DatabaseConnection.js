import mongoose from "mongoose";

beforeAll(async () => {
    let mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    await mongoose.connect(`${global.__MONGO_URI__}`, mongooseOptions);
});

afterAll(async () => {
    mongoose.connection.close();
});
