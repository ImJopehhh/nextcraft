const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const webmaster = await prisma.admin.upsert({
        where: { email: "admin@web.next" },
        update: {},
        create: {
            email: "admin@web.next",
            username: "webmaster",
            password: hashedPassword,
            role: "WEBMASTER",
        },
    });

    console.log({ webmaster });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
