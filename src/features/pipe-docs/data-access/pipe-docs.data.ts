import { PipeDoc } from '../models/pipe-doc.model';
import {
  simThaiBahtText,
  simThaiDate,
  simThaiIdCard,
  simThaiPhone,
} from './playground-sim';

/** ข้อมูลตั้งต้นของหน้า docs — custom Thai pipe 4 ตัวใน src/shared/pipes/ */
export const PIPE_DOCS: readonly PipeDoc[] = [
  {
    slug: 'thai-date',
    category: 'Custom Pipe · วันที่',
    name: 'thaiDate',
    titleAccent: '— วันที่ไทย',
    lede:
      'จัดรูปแบบวันที่เป็นแบบไทย (พ.ศ. พร้อมชื่อเดือน/วันภาษาไทย) ด้วย token format string สไตล์ Angular DatePipe',
    params: [
      {
        name: 'format',
        type: 'string',
        description: "token เช่น 'd MMMM yyyy', 'd MMM yy' หรือ pattern กำหนดเอง — ค่าเริ่มต้น 'd MMMM yyyy'",
        optional: true,
      },
      {
        name: 'era',
        type: "'BE' | 'CE'",
        description: 'ยุคปี: BE = พ.ศ. (ค่าเริ่มต้น), CE = ค.ศ.',
        optional: true,
      },
    ],
    playground: [
      {
        key: 'value',
        label: 'value (วันที่)',
        kind: 'text',
        default: '2026-05-27T14:32:00',
        placeholder: '2026-05-27T14:32:00',
      },
      {
        key: 'format',
        label: 'format',
        kind: 'chips',
        default: 'd MMMM yyyy',
        options: [
          { value: 'd MMMM yyyy' },
          { value: 'd MMM yy' },
          { value: 'dd/MM/yyyy' },
          { value: "EEEE'ที่' d MMMM 'พ.ศ.' yyyy", label: "EEEE'ที่' d MMMM yyyy" },
          { value: 'EEEE d MMM' },
        ],
      },
      {
        key: 'era',
        label: 'era',
        kind: 'chips',
        default: 'BE',
        options: [{ value: 'BE' }, { value: 'CE' }],
      },
    ],
    simulate: simThaiDate,
    code: {
      filename: 'app.component.html',
      language: 'html',
      content: `<!-- ค่าเริ่มต้น: วันที่ เดือนเต็ม ปี พ.ศ. -->
<p>{{ today | thaiDate }}</p>
<!-- → 27 พฤษภาคม 2569 -->

<!-- format ย่อ -->
<p>{{ today | thaiDate:'d MMM yy' }}</p>
<!-- → 27 พ.ค. 69 -->

<!-- literal ในเครื่องหมาย ' ' + วันเต็ม -->
<p>{{ today | thaiDate:"EEEE'ที่' d MMMM 'พ.ศ.' yyyy" }}</p>`,
    },
    notes: [
      'รับได้ทั้ง Date, timestamp (number) และ ISO string; ค่าที่ parse ไม่ได้จะคืนค่าว่าง',
      "ปีเริ่มต้นเป็น พ.ศ. (BE = ค.ศ. + 543); ใส่ข้อความคงที่ด้วย literal ในเครื่องหมาย ' '",
    ],
  },
  {
    slug: 'thai-baht-text',
    category: 'Custom Pipe · จำนวนเงิน',
    name: 'thaiBahtText',
    titleAccent: '— อ่านเงินเป็นคำ',
    lede:
      'อ่านจำนวนเงินเป็นตัวอักษรภาษาไทย จัดการกฎ "ยี่สิบ / เอ็ด / บาทถ้วน / สตางค์" และค่าติดลบให้อัตโนมัติ',
    params: [],
    playground: [
      {
        key: 'value',
        label: 'value (จำนวนเงิน)',
        kind: 'text',
        default: '1234.50',
        placeholder: 'เช่น 1234.50',
      },
    ],
    simulate: simThaiBahtText,
    code: {
      filename: 'app.component.html',
      language: 'html',
      content: `<p>{{ 25000 | thaiBahtText }}</p>
<!-- → สองหมื่นห้าพันบาทถ้วน -->

<p>{{ 1234.5 | thaiBahtText }}</p>
<!-- → หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบสตางค์ -->`,
    },
    notes: [
      'ปัดเศษทศนิยมเป็น 2 ตำแหน่ง (สตางค์); ไม่มีสตางค์จะลงท้าย "บาทถ้วน"',
      'จำนวนเต็มเป็นศูนย์แต่มีสตางค์จะตัด "ศูนย์บาท" ออก เช่น 0.50 → ห้าสิบสตางค์; ค่าติดลบขึ้นต้นด้วย "ลบ"',
    ],
  },
  {
    slug: 'thai-id-card',
    category: 'Custom Pipe · เอกสาร & PDPA',
    name: 'thaiIdCard',
    titleAccent: '— เลขบัตร ปชช.',
    lede:
      'จัดรูปแบบเลขบัตรประชาชน 13 หลักเป็น 1-2345-67890-12-3 พร้อมโหมด mask ปิดข้อมูลตามแนว PDPA',
    params: [
      {
        name: 'mask',
        type: 'boolean',
        description: 'ปิดหลักที่ 7–12 ด้วย * (เปิดหลัก 1–6 และหลักสุดท้าย) — ค่าเริ่มต้น false',
        optional: true,
      },
    ],
    playground: [
      {
        key: 'value',
        label: 'value (เลข 13 หลัก)',
        kind: 'text',
        default: '1234567890123',
        placeholder: '1234567890123',
      },
      {
        key: 'mask',
        label: 'mask',
        kind: 'chips',
        default: 'false',
        options: [{ value: 'false' }, { value: 'true' }],
      },
    ],
    simulate: simThaiIdCard,
    code: {
      filename: 'app.component.html',
      language: 'html',
      content: `<p>{{ '1234567890123' | thaiIdCard }}</p>
<!-- → 1-2345-67890-12-3 -->

<p>{{ '1234567890123' | thaiIdCard:true }}</p>
<!-- → 1-2345-6****-**-3 -->`,
    },
    notes: [
      'ตัดอักขระที่ไม่ใช่ตัวเลขออกก่อนจัดรูปแบบ; เลขไม่ครบ 13 หลักจะจัดกลุ่มเท่าที่มี',
      'mask จะทำงานเมื่อเลขครบ 13 หลักเท่านั้น (เลขไม่ครบยังไม่ปิด)',
    ],
  },
  {
    slug: 'thai-phone',
    category: 'Custom Pipe · เอกสาร & PDPA',
    name: 'thaiPhone',
    titleAccent: '— เบอร์โทรไทย',
    lede:
      'จัดรูปแบบเบอร์โทรไทย (มือถือ/บ้าน) ตรวจประเภทอัตโนมัติ แปลง +66 เป็น 0 และมีโหมด mask เสริม',
    params: [
      {
        name: 'mask',
        type: 'boolean',
        description: 'ปิดกลุ่มตัวเลขตรงกลางด้วย * เช่น 081-***-5678 — ค่าเริ่มต้น false',
        optional: true,
      },
    ],
    playground: [
      {
        key: 'value',
        label: 'value (เบอร์โทร)',
        kind: 'text',
        default: '0812345678',
        placeholder: '0812345678',
      },
      {
        key: 'mask',
        label: 'mask',
        kind: 'chips',
        default: 'false',
        options: [{ value: 'false' }, { value: 'true' }],
      },
    ],
    simulate: simThaiPhone,
    code: {
      filename: 'app.component.html',
      language: 'html',
      content: `<p>{{ '0812345678' | thaiPhone }}</p>
<!-- → 081-234-5678 -->

<p>{{ '0812345678' | thaiPhone:true }}</p>
<!-- → 081-***-5678 -->`,
    },
    notes: [
      'มือถือ 0XX-XXX-XXXX (06/08/09), กทม. 0X-XXX-XXXX (02), ต่างจังหวัด 0XX-XXX-XXX',
      'แปลงรหัสนำหน้า +66 / 66 เป็น 0 อัตโนมัติ; prefix ไม่รู้จัก/ไม่ครบหลักจะคืนตัวเลขตามที่มี',
    ],
  },
];
