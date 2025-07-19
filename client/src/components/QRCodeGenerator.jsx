// import QRCode from 'qrcode.react';

function QRCodeGenerator({ qrCodeData }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-primaryBlue mb-2">Booking QR Code</h3>
      {/* <QRCode value={qrCodeData} size={200} /> */}
      
    </div>
  );
}

export default QRCodeGenerator;