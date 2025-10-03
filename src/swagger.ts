// swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Kapee API Documentation",
      version: "1.0.0",
      description: "API documentation for Kapee backend services.",
    },
    servers: [
      {
        url: "http://localhost:5000/api", // Local dev server
        description: "Local server",
      },
      {
        url: "http://192.168.1.152:5000/api", // LAN
        description: "LAN server",
      },
    ],
  },
  apis: ["./routes/*.ts", "./routes/*.js"], // auto-scan your route files
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
