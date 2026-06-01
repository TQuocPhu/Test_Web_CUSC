import { NextRequest, NextResponse } from "next/server";
import { Request, Response } from "express";
import { TemplateAction } from "../../../../src/modules/templates/actions/templates.action";

const templateAction = new TemplateAction();

interface MockResponse {
  statusCode: number;
  status: (code: number) => MockResponse;
  json: (data: unknown) => MockResponse;
}

type RouteParams = { params: { id: string } };

// [GET] http://localhost:3000/api/templates/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  const mockReq = { params: { id: params.id } };
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

  await templateAction.getTemplateDetail(
    mockReq as unknown as Request, 
    mockRes as unknown as Response
  );
  
  return NextResponse.json(resultData, { status: mockRes.statusCode });
}

// [PUT] http://localhost:3000/api/templates/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const body = await request.json();
  
  const mockReq = { 
    params: { id: params.id },
    body: body 
  };
  
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

  await templateAction.updateTemplate(
    mockReq as unknown as Request, 
    mockRes as unknown as Response
  );
  
  return NextResponse.json(resultData, { status: mockRes.statusCode });
}