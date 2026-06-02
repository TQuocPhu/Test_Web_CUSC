export interface ApiSuccess<T = any> {
  success: true;
  statusCode: number;          // Thêm hẳn status code vào body để FE dễ check không cần ngó header
  message: string;             // Câu thông báo hành động (ví dụ: "Tải danh sách thành công")
  count?: number;              // Tổng số phần tử (Chỉ xuất hiện khi data là một mảng [] hốt từ DB lên)
  pagination?: {               // Dự phòng sau này làm tính năng phân trang (Phân trang phiếu/biểu mẫu)
    currentPage: number;
    totalPages: number;
    pageSize: number;
  };
  data: T;                     // Cục dữ liệu sạch (Có thể là Object chi tiết hoặc Mảng danh sách)
}

export interface ApiError {
  success: false;
  statusCode: number;          // Mã lỗi HTTP (400, 401, 403, 404, 500)
  errorType: "VALIDATION_ERROR" | "DATABASE_ERROR" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "SYSTEM_ERROR"; 
  message: string;             // Câu thông báo lỗi tổng quan hiển thị lên Alert/Toast của UI
  errors?: Record<string, string>; // Bẫy chi tiết: {"title": "Không được trống", "slug": "Sai định dạng"} (Chỉ có khi errorType là VALIDATION_ERROR)
  stack?: string;              // Chỉ bật lên khi ở môi trường DEV để Phú dễ debug log lỗi dòng nào file nào mà không cần mò console
}

export const sendSuccess = <T>(
  data: T, 
  message: string = "Xử lý thành công!", 
  statusCode: number = 200,
  count?: number
): ApiSuccess<T> => {
  return {
    success: true,
    statusCode,
    message,
    count,
    data,
  };
};

export const sendPaginatedSuccess = <T>(
  data: T[],
  message: string,
  page: number,
  limit: number,
  totalItems: number
): ApiSuccess<T[]> => {
  return {
    success: true,
    statusCode: 200,
    message,
    count: data.length,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      pageSize: limit,
    },
    data,
  };
};

// Helper trả về lỗi hệ thống / lỗi logic
export const sendError = (
  message: string, 
  statusCode: number = 400, 
  errorType: ApiError["errorType"] = "SYSTEM_ERROR",
  errors?: Record<string, string>
): ApiError => {
  const response: ApiError = {
    success: false,
    statusCode,
    errorType,
    message,
    errors,
  };

  // Nếu Phú đang chạy ở môi trường local (development), đút thêm stack trace vào để dễ nhìn lỗi
  if (process.env.NODE_ENV === "development") {
    response.stack = new Error().stack;
  }

  return response;
};