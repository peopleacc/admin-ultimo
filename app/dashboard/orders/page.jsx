
import OrdPen from "@/app/components/comp_orders/ord_pen";
import OrdProg from "@/app/components/comp_orders/ord_prog";


export default function OrdersPage() {
  return (
    <div className="flex flex-row w-full gap-4">
      <div className="w-1/2">
        <OrdPen />
      </div>
      <div className="w-1/2">
        <OrdProg />
      </div>
      
    </div>
  );
}