import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { buildOwnersWorkbook } from "@/lib/excel/buildOwnersWorkbook";

export async function GET(req: Request) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Không có quyền truy cập." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const idsParam = searchParams.get("ids");
  const ownerIds = idsParam && idsParam !== "all" ? idsParam.split(",").filter(Boolean) : null;

  const supabase = await createClient();
  const result = await buildOwnersWorkbook(supabase, ownerIds);

  if (!result) {
    return NextResponse.json({ error: "Không có chủ sở hữu nào để xuất." }, { status: 400 });
  }

  const buffer = await result.workbook.xlsx.writeBuffer();
  const filename =
    result.owners.length === 1
      ? `${result.owners[0].owner_code}-danh-sach-phong.xlsx`
      : `tong-hop-${result.owners.length}-chu-so-huu.xlsx`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
