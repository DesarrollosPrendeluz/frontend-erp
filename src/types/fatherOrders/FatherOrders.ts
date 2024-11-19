export default interface FatherOrder {
    id: number; // Identificador único
    code: string; // Código del registro
    status_id: number; // ID del estado
    type_id: number; // ID del tipo
    status: string; // Descripción del estado
    type: string; // Descripción del tipo
    total_stock: number; // Cantidad total de stock
    pending_stock: number; // Cantidad de stock pendiente
}
