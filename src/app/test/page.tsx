export default function TestPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Test Page</h1>
      <p>If you can see this, Next.js routing is working on Vercel!</p>
      <p>Current time: {new Date().toISOString()}</p>
    </div>
  );
}