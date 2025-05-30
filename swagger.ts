import swaggerAutogen from 'swagger-autogen';
import { SwaggerDoc } from './src/types/generalTypes'; // Ensure this path is correct

const doc: SwaggerDoc = {
  info: {
    title: 'Crypto investor',
    description:
      'API Documentation for Crypto investor',
    version: '1.0.0'
  },
  host: process.env.BE_URL || 'localhost:8000',
  basePath: '/',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: []
};

const outputFile: string = './swagger_output.json'; // Generated Swagger file
const endpointsFiles: string[] = ['./src/routes/index.ts']; // Path to the API routes files

const generateSwagger = async (): Promise<void> => {
  try {
    const result = await swaggerAutogen(outputFile, endpointsFiles, doc);
    console.log('Swagger file generated', result);
  } catch (error) {
    console.error('Error generating Swagger file:', error);
  }
};

generateSwagger();
