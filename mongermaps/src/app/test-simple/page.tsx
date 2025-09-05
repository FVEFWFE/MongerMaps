export const dynamic = 'force-dynamic'

export default function TestSimple() {
  return (
    <div>
      <h1>Simple Test Page</h1>
      <p>This page uses force-dynamic to avoid build errors.</p>
      <p>Current time: {new Date().toISOString()}</p>
    </div>
  )
}