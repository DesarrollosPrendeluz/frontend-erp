interface Supplier{
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
    SupplierItems:SupplierItem[];
  }
  
   export default interface StoreItems {
    Itemname: string;
    SKU: string;
    Amount: string;
    PendingAmount: string;
    Item: ItemData;
    SKU_Parent:string;
  }