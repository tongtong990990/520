import { redirect } from "next/navigation";

/** 路由别名：主流程由首页 GameApp 统一管理 */
export default function OpeningPage() {
  redirect("/");
}
