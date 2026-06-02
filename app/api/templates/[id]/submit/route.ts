import { NextRequest, NextResponse } from "next/server";
import { Request, Response } from "express";
import { TemplateAction } from "../../../../../src/modules/templates/actions/templates.action"; //

const templateAction = new TemplateAction();

// Định nghĩa Interface giả lập Response độc lập để hứng dữ liệu từ Action
interface MockResponse {
  statusCode: number;
  status: (code: number) => MockResponse;
  json: (data: unknown) => MockResponse;
}

// Định nghĩa kiểu dữ liệu cho tham số ID trên URL
type RouteParams = { params: { id: string } };

// [POST] http://localhost:3000/api/templates/[id]/submit
export async function POST(request: NextRequest, { params }: RouteParams) {
  // 1. Đọc dữ liệu JSON gửi lên từ Postman (Cụm 2)
  const resolvedParams = await params;
  const body = await request.json();
  
  // 2. Gom cả params.id và body vào một Object giả lập Request của Express
  const mockReq = { 
    params: { id: resolvedParams.id },
    body: body 
  };
  
  let resultData: unknown = null;

  // 3. Tạo Object giả lập Response của Express
  const mockRes: MockResponse = {
    statusCode: 200,
    status: function (code: number) { 
      this.statusCode = code; 
      return this; 
    },
    json: function (data: unknown) { 
      resultData = data; 
      return this; 
    }
  };

  // 4. Kích hoạt hàm xử lý điền đơn trong file Action của ông Phú
  await templateAction.submitForm(
    mockReq as unknown as Request, 
    mockRes as unknown as Response
  );
  
  // 5. Trả kết quả về cho Postman theo đúng chuẩn mã lỗi HTTP
  return NextResponse.json(resultData, { status: mockRes.statusCode });
}