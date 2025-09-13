"use client";
import PageHeader from "@/app/(dashboard)/_components/pageHeader";
import { useParams } from "next/navigation";

export default function OrderSubstitution() {
  const { substitute } = useParams();
  return (
    <div>
      <PageHeader
        title={"Order Substitution"}
        bredcume={"Dashboard / Orders / Substitution"}
      />
      <div>Order Substitution : #{substitute[1]}</div>
    </div>
  );
}
