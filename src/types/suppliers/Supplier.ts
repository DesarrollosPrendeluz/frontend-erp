 interface Supplier {
    Id:number,
    Name:string;
  }

  export default interface Suppliers{
    map(arg0: (supplier: any) => import("react").JSX.Element): import("react").ReactNode;
    Data: Supplier[];
}