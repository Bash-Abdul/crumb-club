export default function Loading() {
  return (
    <div className="app-main app-loading" role="status">
      <p>Putting the kettle on…</p>
      <div className="loading-block" aria-hidden="true" />
    </div>
  );
}
