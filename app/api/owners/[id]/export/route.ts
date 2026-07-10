import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { formatPrice } from "@/lib/format";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Không có quyền truy cập." }, { status: 403 });
  }

  const { id } = await params;
  const supabase = await createClient();

  const { data: owner } = await supabase
    .from("owners")
    .select("owner_code, full_name")
    .eq("id", id)
    .single();

  if (!owner) {
    return NextResponse.json({ error: "Không tìm thấy chủ sở hữu." }, { status: 404 });
  }

  const { data: buildings } = await supabase
    .from("buildings")
    .select("id, district, ward, alley, house_number")
    .eq("owner_id", id);

  const buildingIds = (buildings ?? []).map((b) => b.id);
  const buildingsById = new Map((buildings ?? []).map((b) => [b.id, b]));

  const { data: units } = buildingIds.length
    ? await supabase
        .from("units")
        .select("building_id, room_number, unit_type, price_month, status, details_text, gdrive_folder_link, note")
        .in("building_id", buildingIds)
        .order("room_number")
    : { data: [] };

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Danh sách phòng");

  sheet.columns = [
    { header: "Quận/Huyện", key: "district", width: 16 },
    { header: "Phường/Xã", key: "ward", width: 18 },
    { header: "Ngõ/Ngách", key: "alley", width: 24 },
    { header: "Số nhà", key: "houseNumber", width: 12 },
    { header: "Số phòng", key: "roomNumber", width: 10 },
    { header: "Loại phòng", key: "unitType", width: 12 },
    { header: "Giá thuê/tháng (VNĐ)", key: "price", width: 18 },
    { header: "Tình trạng", key: "status", width: 14 },
    { header: "Thông tin chi tiết", key: "details", width: 40 },
    { header: "Link Drive", key: "gdrive", width: 30 },
    { header: "Ghi chú", key: "note", width: 24 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const u of units ?? []) {
    const b = buildingsById.get(u.building_id);
    sheet.addRow({
      district: b?.district ?? "",
      ward: b?.ward ?? "",
      alley: b?.alley ?? "",
      houseNumber: b?.house_number ?? "",
      roomNumber: u.room_number,
      unitType: u.unit_type,
      price: formatPrice(u.price_month),
      status: u.status,
      details: u.details_text ?? "",
      gdrive: u.gdrive_folder_link ?? "",
      note: u.note ?? "",
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${owner.owner_code}-danh-sach-phong.xlsx"`,
    },
  });
}
