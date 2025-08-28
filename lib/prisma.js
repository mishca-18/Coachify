const { PrismaClient } = require("../lib/generated/prisma");

const db = new PrismaClient();

module.exports = { db };


