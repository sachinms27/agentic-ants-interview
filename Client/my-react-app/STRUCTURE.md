# Project Structure

This React application has been set up with a clean, organized structure for components, routing, and API integration.

## Folder Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation component
│   └── index.js        # Component exports
├── data/               # API and data management
│   ├── api.js          # API service functions
│   └── useData.js      # Custom hook for data management
├── layouts/            # Layout components
│   └── MainLayout.jsx  # Main application layout
├── pages/              # Page components
│   ├── Home.jsx        # Home page
│   ├── About.jsx       # About page
│   ├── Data.jsx        # Data/API demo page
│   └── index.js        # Page exports
├── App.jsx             # Main app component with routing
└── main.jsx            # Application entry point
```

## Features

### React Router DOM
- Client-side routing with `react-router-dom`
- Nested routes with layout wrapper
- Clean URL structure (`/`, `/about`, `/data`)

### Component Architecture
- Modular, reusable components
- Separation of concerns
- Consistent naming conventions

### API Integration
- Ready-to-use API service functions
- Error handling and loading states
- Custom hooks for data management
- Uses JSONPlaceholder API for demonstration

### Styling
- Responsive CSS design
- Modern UI components
- Mobile-friendly navigation

## Usage

### Navigation
The app includes a navigation bar with links to all pages. The routing is handled by React Router DOM.

### API Integration
The `data` page demonstrates API integration with:
- Data fetching
- Loading states
- Error handling
- Data display

### Custom Hooks
Use the `useData` hook for easy data management:
```jsx
import { useData } from './data/useData'

const { data, loading, error, getData } = useData()
```

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Navigate to `http://localhost:5173`

## API Configuration

The API service is configured to use JSONPlaceholder by default. You can modify the `API_BASE_URL` in `src/data/api.js` to point to your own API endpoints.

## Adding New Features

- **New Components**: Add to `src/components/`
- **New Pages**: Add to `src/pages/` and update routing in `App.jsx`
- **New API Endpoints**: Add functions to `src/data/api.js`
- **New Hooks**: Create in `src/data/` or `src/hooks/`
