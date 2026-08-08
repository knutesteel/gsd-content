import { ModulePage } from "@/components/module-page";
export default async function Page({searchParams}:{searchParams:Promise<{notice?:string}>}) { const p=await searchParams; return <ModulePage module="retail" notice={p.notice}/>; }
