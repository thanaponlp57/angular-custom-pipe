/** ชนิดของช่อง input ใน playground: ช่องพิมพ์ข้อความ หรือกลุ่มปุ่ม chip ให้เลือก 1 ค่า */
export type PlaygroundFieldKind = 'text' | 'chips';

/** ตัวเลือกของ chip — value = ค่าที่ส่งเข้า simulate, label = ข้อความบนปุ่ม (ไม่ใส่ = ใช้ value) */
export interface ChipOption {
  value: string;
  label?: string;
}

/** นิยามช่อง input หนึ่งช่องใน playground */
export interface PlaygroundField {
  /** คีย์ที่ใช้เก็บค่าใน state เช่น 'value', 'format', 'era', 'mask' */
  key: string;
  /** ป้ายกำกับภาษาไทยที่แสดงบนหน้าจอ */
  label: string;
  kind: PlaygroundFieldKind;
  /** ค่าเริ่มต้นของช่องนี้ (เป็นสตริงเสมอ เพื่อให้ state เป็นชนิดเดียวกัน) */
  default: string;
  /** placeholder สำหรับช่องชนิด text */
  placeholder?: string;
  /** ตัวเลือกสำหรับช่องชนิด chips */
  options?: readonly ChipOption[];
}

/** พารามิเตอร์ของ pipe หนึ่งตัว (แสดงในตาราง Parameters) */
export interface PipeParam {
  name: string;
  type: string;
  /** คำอธิบายภาษาไทย */
  description: string;
  optional: boolean;
}

/** โค้ดตัวอย่างในส่วน Template usage */
export interface PipeCode {
  filename: string;
  language: string;
  content: string;
}

/**
 * ฟังก์ชันจำลองผลลัพธ์ของ pipe ใน playground
 *
 * รับค่า value (จากช่อง text) และ selections (map ของ key → ค่าที่เลือกจาก chip)
 * คืนสตริงผลลัพธ์ — จำลองแยกต่างหากจาก pipe จริงตามที่ออกแบบไว้
 * (ดู playground-sim.ts; มี spec ยืนยันว่าผลตรงกับ pipe จริง)
 */
export type PipeSimulate = (value: string, selections: Record<string, string>) => string;

/** เอกสารของ custom pipe หนึ่งตัว — เป็นข้อมูลตั้งต้นของหนึ่งหน้าใน pager */
export interface PipeDoc {
  /** ใช้เป็น key ของหน้าและรีเซ็ต state ของ playground เมื่อสลับ pipe */
  slug: string;
  /** ข้อความ eyebrow ฝั่งซ้าย เช่น 'Custom Pipe · วันที่' */
  category: string;
  /** ชื่อ pipe เช่น 'thaiDate' */
  name: string;
  /** ส่วนเอียงสีเน้นต่อท้ายชื่อในหัวข้อ เช่น '— วันที่ไทย' */
  titleAccent: string;
  /** คำโปรยอธิบายภาษาไทย */
  lede: string;
  params: readonly PipeParam[];
  playground: readonly PlaygroundField[];
  simulate: PipeSimulate;
  code: PipeCode;
  notes: readonly string[];
}
