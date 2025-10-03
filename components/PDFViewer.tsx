export default function PDFViewer({url}: {url:string}) {
    console.log(url);
    
    return (
        <div onContextMenu={(e) => e.preventDefault()}>
      <h1 className="text-lg font-semibold mb-4">PDF Viewer</h1>
      <iframe
        src={url}
        width="100%"
        height="800px"
        style={{ border: "1px solid #e5e7eb", borderRadius: 6 }}
      />
    </div>
    )
}