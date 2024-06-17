export default function Idle() {
  return (
    <div style={{ position: "absolute", width: "100%", height: "100%" }}>
      <img
        src={`${window.resourcesPath}/public/idleImage/idle.png`}
        alt="Idle"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}
