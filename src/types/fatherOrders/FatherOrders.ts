export interface ChildOrder {
    id: number;            // Identificador único
    code: string;          // Código del registro
    status_id: number;     // ID del estado
    status: string;        // Descripción del estado
    quantity: number;      // Cantidad total
    recived_quantity: number; // Cantidad recibida
}






export  interface FatherOrder {
    id: number; // Identificador único
    code: string; // Código del registro
    status_id: number; // ID del estado
    type_id: number; // ID del tipo
    status: string; // Descripción del estado
    type: string; // Descripción del tipo
    total_stock: number; // Cantidad total de stock
    pending_stock: number; // Cantidad de stock pendiente
    total_picking_stock: number; // Cantidad total de stock 
    total_recived_picking_quantity: number; // Cantidad de stock pendiente
    Childs : ChildOrder[]
   
}
