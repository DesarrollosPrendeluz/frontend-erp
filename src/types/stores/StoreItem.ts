interface Supplier{
    ID: Number
    Name:string;
    DeliveryTime:number;
  }
  
  interface SupplierItem{
    SupplierSku:string;
    Supplier:Supplier;
  }
  
  interface ItemData{
    ID:number
    Name:string;
    EAN:string;
    SupplierItems:SupplierItem[];
  }
  
   export default interface StoreItems {
    Itemname: string;
    SKU: string;
    Ean: string;
    Amount: string;
    PendingAmount: string;
    Item: ItemData;
    SKU_Parent:string;
  }