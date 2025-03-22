const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Doc",
            version: "1.0.0",
            description: "Documentação automática com Swagger",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor de Desenvolvimento",
            },
        ],
    },
    apis: ["./server.js"],
};

const swaggerDocs = swaggerJsDoc(options);

const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = setupSwagger;
