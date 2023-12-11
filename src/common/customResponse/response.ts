export class CustomResponse {

    public response(status: string, message: any, entity: any, createdAt: Date) {
        const response: CustomResponseInterface =  {
            "status" : status,
            "message" : message,
            "entity": entity,
            "createdAt" : createdAt
        }
        return response;
    }
    
}

export interface CustomResponseInterface {
    status: string;
    message: string;
    entity: any;
    createdAt: Date;
}