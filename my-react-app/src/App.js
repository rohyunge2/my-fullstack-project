import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // 테이블 스타일 정의
  const tableHeaderStyle = {
    padding: '12px 8px',
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#333',
    borderBottom: '2px solid #ddd',
    fontSize: '14px'
  };

  const tableCellStyle = {
    padding: '10px 8px',
    color: '#333',
    fontSize: '13px',
    maxWidth: '150px',
    wordBreak: 'break-word'
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log('Selected file:', file.name);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    document.getElementById('excel-upload').value = '';
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:8080/api/upload/excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload successful:', response.data);
      setAnalysisResult(response.data);
      alert('파일 분석 완료!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('파일 업로드 실패: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {selectedFile && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f0f0f0',
              padding: '8px 12px',
              borderRadius: '5px',
              color: '#333'
            }}>
              <span style={{ marginRight: '8px', fontSize: '14px' }}>
                {selectedFile.name}
              </span>
              <button
                onClick={handleRemoveFile}
                style={{
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
          )}

          <input
            type="file"
            id="excel-upload"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <label
            htmlFor="excel-upload"
            style={{
              padding: '12px 24px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            엑셀 파일 업로드
          </label>

          {selectedFile && (
            <button
              onClick={handleAnalyze}
              disabled={isUploading}
              style={{
                padding: '12px 24px',
                backgroundColor: isUploading ? '#cccccc' : '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {isUploading ? '업로드 중...' : '분석'}
            </button>
          )}
        </div>

        {/* 분석 결과 표시 */}
        {analysisResult && (
          <div style={{ marginTop: '30px', maxWidth: '1200px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: 'white', marginBottom: '10px' }}>계약 비교 분석 결과</h3>
              <div style={{
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap',
                fontSize: '14px',
                color: '#ccc'
              }}>
                <span>총 계약 수: {analysisResult.contractComparison?.uniqueContracts || 0}</span>
                <span>매칭 계약: {analysisResult.contractComparison?.matchingContracts || 0}</span>
                <span>B열만: {analysisResult.contractComparison?.bOnlyContracts || 0}</span>
                <span>D열만: {analysisResult.contractComparison?.dOnlyContracts || 0}</span>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={tableHeaderStyle}>B (계약번호)</th>
                    <th style={tableHeaderStyle}>C (금액)</th>
                    <th style={tableHeaderStyle}>D (계약번호)</th>
                    <th style={tableHeaderStyle}>E (금액)</th>
                    <th style={tableHeaderStyle}>F (금액 차이)</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisResult.contractComparison?.data?.slice(1).map((row, index) => (
                    <tr key={index} style={{
                      borderBottom: '1px solid #eee',
                      backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9'
                    }}>
                      {row.slice(1).map((cell, cellIndex) => (
                        <td key={cellIndex} style={tableCellStyle}>
                          {cellIndex === 4 ?
                            // F열(금액 차이)인 경우 괄호 부분 제거
                            (cell || '-').toString().replace(/\s*\([^)]*\)$/, '')
                            :
                            (cell || '-')
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;