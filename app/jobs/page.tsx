import { Suspense } from "react";
import JobsClient from "./JobsClient";

export const metadata = {
  title: "アクチュアリー求人一覧",
  description:
    "生命保険・損害保険・再保険・コンサル・年金を中心としたアクチュアリー特化求人を条件から探す。",
};

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="container-x py-16">読み込み中...</div>}>
      <JobsClient />
    </Suspense>
  );
}
