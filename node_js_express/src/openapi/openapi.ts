import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import {z} from 'zod';
import {brewSchema, createBrewSchema} from '../schemas/brew.schema';
import {config} from '../config/config';
import {querySchema} from '../schemas/query.schema';
import {paramsSchema} from '../schemas/params.schema';

const registry = new OpenAPIRegistry();

registry.register('Brew', brewSchema);
registry.register('CreateBrew', createBrewSchema);

registry.registerPath({
  method: 'get',
  path: '/api/brews',
  summary: 'Get all brews',
  tags: ['Brews'],
  request: {
    query: querySchema,
  },
  responses: {
    200: {
      description: 'Successfully retrieve all brews',
      content: {
        'application/json': {
          schema: z.array(brewSchema),
        }
      }
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/brews/{id}',
  summary: 'Get brew',
  tags: ['Brews'],
  request: {
    params: paramsSchema,
  },
  responses: {
    200: {
      description: 'Successfully retrieve brew',
      content: {
        'application/json': {
          schema: brewSchema,
        }
      }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/brews',
  summary: 'Create new brew',
  tags: ['Brews'],
  request: {
    body: {
      description: 'Create new brew request body',
      required: true,
      content: {
        'application/json': {
          schema: createBrewSchema,
        }
      },
    }
  },
  responses: {
    201: {
      description: 'Successfully create new brew',
      content: {
        'application/json': {
          schema: brewSchema,
        }
      }
    }
  }
});

registry.registerPath({
  method: 'put',
  path: '/api/brews/{id}',
  summary: 'Update brew',
  tags: ['Brews'],
  request: {
    params: paramsSchema,
    body: {
      description: 'Update brew request body',
      required: true,
      content: {
        'application/json': {
          schema: createBrewSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Successfully updated brew',
      content: {
        'application/json': {
          schema: brewSchema,
        }
      }
    }
  }
});

registry.registerPath({
  method: 'delete',
  path: '/api/brews/{id}',
  summary: 'Delete brew',
  tags: ['Brews'],
  request: {
    params: paramsSchema
  },
  responses: {
    204: {
      description: 'Successfully deleted brew',
    }
  }
});

export const openapiDocument = new OpenApiGeneratorV3(registry.definitions).generateDocument({
  openapi: '3.0.3',
  info: { title: 'Brew API', version: '1.0.0' },
  servers: [{ url: `http://localhost:${config.port}` }],
});

