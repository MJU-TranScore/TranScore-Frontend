import React from 'react';

function UploadPage() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="border-4 border-dashed border-gray-300 rounded-lg p-10 text-center w-2/3 max-w-xl">
        <p className="text-lg text-gray-600 mb-4">
          PDF 또는 이미지 파일을 여기에 드래그 앤 드롭하세요
        </p>
        <p className="text-sm text-gray-400">또는 클릭하여 파일 선택</p>
      </div>
    </div>
  );
}

export default UploadPage;