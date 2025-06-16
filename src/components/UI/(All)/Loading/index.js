export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "white",
      }}
    >
      <h1 style={{ color: "var(--main)" }}>Đang tải...</h1>
    </div>
  );
}