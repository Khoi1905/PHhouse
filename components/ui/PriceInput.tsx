"use client";

import { forwardRef, useEffect, useRef, useState, type InputHTMLAttributes } from "react";
import { trieuStrToVnd, vndToTrieuStr } from "@/lib/format";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> & {
  /** Giá đang lưu, đơn vị VNĐ. null = chưa có/chưa hợp lệ. */
  valueVnd: number | null;
  /** Bắn ra sau mỗi phím gõ. null khi chuỗi hiện tại chưa parse được. */
  onChangeVnd: (vnd: number | null) => void;
};

/**
 * Ô nhập giá theo đơn vị TRIỆU ĐỒNG, lưu ra VNĐ.
 *
 * Hai điểm bắt buộc, đều là nguyên nhân của lỗi "không gõ được số thập phân":
 *
 * 1. KHÔNG dùng type="number". Theo chuẩn HTML, input số trả về chuỗi RỖNG khi
 *    nội dung chưa phải số hoàn chỉnh — nên đúng lúc người dùng vừa gõ dấu phân
 *    cách ("5."), giá trị đọc được đã là "" rồi. Dấu phẩy kiểu Việt Nam ("5,6")
 *    còn bị loại thẳng. Dùng type="text" + inputMode="decimal" để vẫn ra bàn
 *    phím số trên điện thoại nhưng trình duyệt không tự ý vứt nội dung.
 *
 * 2. Chuỗi đang hiển thị phải là state RIÊNG của ô, không được tính lại từ con
 *    số đã lưu. Nếu vẽ lại bằng vndToTrieuStr(số) sau mỗi phím thì "5." lập tức
 *    bị làm tròn thành "5" và người dùng không bao giờ gõ tiếp được.
 *
 * Chỉ đồng bộ ngược từ prop khi giá trị đổi vì lý do BÊN NGOÀI (mở sửa phòng
 * khác, form reset) — nhận biết bằng cách so với giá trị chính ô này vừa bắn ra.
 */
export const PriceInput = forwardRef<HTMLInputElement, Props>(function PriceInput(
  { valueVnd, onChangeVnd, ...props },
  ref
) {
  const [text, setText] = useState(() => vndToTrieuStr(valueVnd));
  const emittedRef = useRef<number | null>(valueVnd);

  useEffect(() => {
    if (valueVnd !== emittedRef.current) {
      emittedRef.current = valueVnd;
      setText(vndToTrieuStr(valueVnd));
    }
  }, [valueVnd]);

  function handleChange(raw: string) {
    // Chặn chữ cái/ký tự lạ ngay khi gõ, nhưng vẫn cho giữ "5." hay "5," dở dang.
    const cleaned = raw.replace(/[^\d.,]/g, "");
    setText(cleaned);
    const vnd = trieuStrToVnd(cleaned);
    emittedRef.current = vnd;
    onChangeVnd(vnd);
  }

  return (
    <input
      ref={ref}
      {...props}
      type="text"
      inputMode="decimal"
      value={text}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
});
