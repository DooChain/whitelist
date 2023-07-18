"use client";
import { useAccount } from "wagmi";
export default function Home() {
  const { address, isConnected } = useAccount();
  console.log(address);
  if (address !== "0x47039C514D7d06DA97a1B6c61931dAF710Aa50bF")
    return <div>You have no permission</div>;
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="relative mb-6" data-te-input-wrapper-init>
        <textarea
          className="border-x-2 border-b-2 peer block min-h-[auto] w-full rounded border-1 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
          id="exampleFormControlTextarea1"
          rows="3"
          placeholder="Your message"
        ></textarea>
        <label
          for="exampleFormControlTextarea1"
          className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
        >
          Example textarea
        </label>
      </div>
    </div>
  );
}
