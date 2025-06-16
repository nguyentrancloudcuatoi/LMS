const uploadRes = await fetch("https://generativelanguage.googleapis.com/v1beta/files:upload?key=YOUR_API_KEY", {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "X-Goog-Upload-File-Name": "yourfile.pdf",
      "X-Goog-Upload-Protocol": "raw",
    },
    body: fileBlob // blob hoặc Buffer của file
  });
  
  const { name: fileId } = await uploadRes.json(); 
  