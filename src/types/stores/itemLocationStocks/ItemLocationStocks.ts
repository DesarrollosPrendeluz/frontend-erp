export default interface ItemLocationStockStoreItem {
    ID: number;
    ItemMainSku: string;
    StoreLocationID: number;
    Stock: number;
    CreatedAt: string; // ISO 8601 format
    UpdatedAt: string; // ISO 8601 format
    StoreLocations: StoreLocation;
  }
  
  interface StoreLocation {
    ID: number;
    StoreID: number;
    Code: string;
    Name: string;
    CreatedAt: string; // ISO 8601 format
    UpdatedAt: string; // ISO 8601 format
  }