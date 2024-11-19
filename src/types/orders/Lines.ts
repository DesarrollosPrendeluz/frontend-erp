export default interface OrderLine {
    id: number;             // Identificador único del elemento
    order_id: number;       // ID de la orden asociada
    quantity: number;       // Cantidad total
    recived_quantity: number; // Cantidad recibida
    main_sku: string;       // SKU principal del producto
    ean: string;            // Código EAN del producto
    name: string;           // Nombre completo del producto
    supplier: string;       // Proveedor del producto
    supplier_reference: string;       // Proveedor del producto
    locations: string[];    // Ubicaciones asociadas al producto
    AssignedUser: AssignedUser; // Detalles del usuario asignado
}
interface AssignedUser {
    assignation_id: number; // ID de asignación
    user_id: number;        // ID del usuario
    user_name: string;      // Nombre del usuario
}