module.exports = {
    verbose: true,

    // These are required for running tests relying on database.
    globalSetup: "./test/environment/GlobalSetup",
    globalTeardown: "./test/environment/GlobalTeardown",
    testEnvironment: "./test/environment/TestEnvironment"
};
