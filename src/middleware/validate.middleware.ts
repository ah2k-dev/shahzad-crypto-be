import { Request, Response, NextFunction } from 'express';
import { AnySchema } from 'joi';

type ValidationType = 'body' | 'params' | 'query';

export const validate = (schema: AnySchema, type: ValidationType = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    let dataToValidate: any;
    
    switch (type) {
      case 'params':
        dataToValidate = req.params;
        break;
      case 'query':
        dataToValidate = req.query;
        break;
      default:
        dataToValidate = req.body;
    }
    
    const { error } = schema.validate(dataToValidate);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    next();
  };
};
