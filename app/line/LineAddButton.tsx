"use client";

export default function LineAddButton() {
  return (
    <button
      onClick={() => alert("LINE公式アカウント（デモ）")}
      className="btn w-full bg-[#06C755] text-white hover:bg-[#05a948]"
    >
      LINEで友だち追加
    </button>
  );
}
