package com.example.demo.controller;

import com.example.demo.service.ExcelReaderService;
import com.example.demo.service.ContractComparisonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "http://localhost:3000")
public class FileUploadController {

    @Autowired
    private ExcelReaderService excelReaderService;

    @Autowired
    private ContractComparisonService contractComparisonService;

    @PostMapping("/excel")
    public ResponseEntity<Map<String, Object>> uploadExcel(@RequestParam("file") MultipartFile file) {
        try {
            // 파일 유효성 검사
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "파일이 비어있습니다."));
            }

            // 파일 형식 검사 (엑셀 파일인지 확인)
            String contentType = file.getContentType();
            String filename = file.getOriginalFilename();

            if (!isExcelFile(contentType, filename)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "엑셀 파일(.xlsx, .xls)만 업로드 가능합니다."));
            }

            // 엑셀 파일 읽기
            Map<String, Object> excelData = excelReaderService.readFirstSheet(file);

            // 계약 데이터 처리 (B열, C열, D열, E열 비교 및 F열에 차이 계산)
            @SuppressWarnings("unchecked")
            List<List<String>> rawData = (List<List<String>>) excelData.get("data");
            Map<String, Object> processedData = contractComparisonService.processContractData(rawData);

            // 파일 정보와 함께 처리된 데이터 반환
            Map<String, Object> response = new java.util.LinkedHashMap<>();
            response.put("message", "파일 업로드 및 계약 비교 분석 완료");
            response.put("filename", filename);
            response.put("size", file.getSize());
            response.put("contentType", contentType);
            response.put("originalExcelData", excelData);
            response.put("contractComparison", processedData);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "파일 업로드 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    private boolean isExcelFile(String contentType, String filename) {
        if (filename == null) return false;

        String lowerFilename = filename.toLowerCase();
        return lowerFilename.endsWith(".xlsx") ||
               lowerFilename.endsWith(".xls") ||
               "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(contentType) ||
               "application/vnd.ms-excel".equals(contentType);
    }
}