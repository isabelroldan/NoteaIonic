export interface Note {
    key?:string,
    title:string,
    description?:string,
    date:string
    img?:string,
    position?: {
        latitude: number;
        longitude: number;
      };
}
