const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to My App</h1>
      <p>This is the home page of your React application.</p>
      <div className="features">
        <div className="feature-card">
          <h3>React Router</h3>
          <p>Navigation and routing setup complete</p>
        </div>
        <div className="feature-card">
          <h3>Component Structure</h3>
          <p>Organized component architecture</p>
        </div>
        <div className="feature-card">
          <h3>API Integration</h3>
          <p>Ready for data fetching</p>
        </div>
      </div>
    </div>
  )
}

export default Home
