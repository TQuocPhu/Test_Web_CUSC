import { NextRequest, NextResponse } from "next/server";
import { Request, Response } from "express";
import { TemplateAction } from "../../../src/modules/templates/actions/templates.action";

const templateAction = new TemplateAction();

// Định nghĩa giao diện độc lập, không kế thừa từ Express nữa để tránh lỗi xung đột hàm Event
interface MockResponse {
  statusCode: number;
  status: (code: number) => MockResponse;
  json: (data: unknown) => MockResponse;
}

// [GET] http://localhost:3000/api/templates
export async function GET(request: NextRequest) {
  let resultData: unknown = null;
  
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

  // Ép sang unknown rồi mới sang Request/Response của Express để đi qua bộ lọc tham số
  await templateAction.getAllTemplates(
    request as unknown as Request, 
    mockRes as unknown as Response
  );
  
  return NextResponse.json(resultData, { status: mockRes.statusCode });
}

// [POST] http://localhost:3000/api/templates
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const mockReq = { body };
  let resultData: unknown = null;

  const mockRes: MockResponse = {
    statusCode: 201,
    status: function (code: number) { 
      this.statusCode = code; 
      return this; 
    },
    json: function (data: unknown) { 
      resultData = data; 
      return this; 
    }
  };

  await templateAction.createTemplate(
    mockReq as unknown as Request, 
    mockRes as unknown as Response
  );
  
  return NextResponse.json(resultData, { status: mockRes.statusCode });
}