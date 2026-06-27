export default function BackgroundCircles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="bg-circle circle-1" />
      <div className="bg-circle circle-2" />
      <div className="bg-circle circle-3" />
      <div className="bg-circle circle-4" />
    </div>
  );
}
