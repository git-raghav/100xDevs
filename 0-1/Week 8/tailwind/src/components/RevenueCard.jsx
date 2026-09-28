import { ChevronRight } from "lucide-react";
export function RevenueCard({ title, amount, orderCount }) {
	return (
		<div className="grow rounded-lg bg-white p-5 flex flex-col gap-4 shadow-sm h-fit min-w-75">
			<h5 className="flex gap-3 items-center text-[#4D4D4D]">{title} ?</h5>
			<div className="flex justify-between items-center">
				<p className="text-3xl font-medium">₹{amount}</p>
				<p className="flex items-center font-medium text-base underline text-[#146EB4]">{orderCount} orders </p>
			</div>
		</div>
	);
}
