# Vision Flow - Modern Goal Management Platform

Transform your aspirations into reality with an interactive, AI-powered goal management platform combining visual motivation, progress tracking, and intelligent coaching insights.

## ✨ Features

### Core Features
- **Goal Dashboard** - Visual overview of all your goals with progress metrics
- **Progress Tracking** - Real-time progress bars and milestone completion tracking
- **AI Coaching Insights** - Intelligent suggestions based on your goal patterns
- **Milestone Management** - Break goals into actionable steps
- **Category Organization** - Organize goals by Business, Learning, Health, Personal, Finance
- **Priority Levels** - Set High, Medium, Low priority for each goal
- **Visual Analytics** - Charts showing progress overview and category breakdown
- **Quick Stats** - At-a-glance metrics: total goals, completion rate, average progress

### User Experience
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Smooth Animations** - Fluid transitions and interactions
- **Real-time Updates** - Instant feedback on progress changes
- **Interactive Expandable Cards** - Click to expand and manage individual goals
- **Modern UI** - Clean, gradient-based design with intuitive navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager
- React 18+

### Installation

```bash
# Clone the repository
git clone https://github.com/Guskolx/VISION-FLOW.git
cd VISION-FLOW

# Install dependencies
npm install

# Start development server
npm start
```

The application will open at `http://localhost:3000`

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "recharts": "^2.10.0",
  "tailwindcss": "^3.3.0"
}
```

### Install Dependencies

```bash
npm install react recharts tailwindcss
```

## 🏗️ Project Structure

```
VISION-FLOW/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Main dashboard view
│   │   ├── GoalCard.jsx           # Individual goal card component
│   │   ├── ProgressChart.jsx      # Progress visualization
│   │   ├── StatsCard.jsx          # Statistics card component
│   │   └── AIInsight.jsx          # AI coaching insights
│   ├── hooks/
│   │   ├── useGoals.js            # Goals state management
│   │   └── useLocalStorage.js     # Persist data to localStorage
│   ├── utils/
│   │   ├── calculations.js        # Math utilities for progress
│   │   ├── dateUtils.js           # Date handling
│   │   └── constants.js           # App constants (categories, colors, etc.)
│   ├── styles/
│   │   ├── globals.css            # Global styles
│   │   └── components.css         # Component styles
│   └── App.jsx                    # Main app component
├── public/
│   ├── index.html
│   └── favicon.ico
├── package.json
├── tailwind.config.js
└── README.md
```

## 💡 Usage Guide

### Creating a New Goal

1. Click the **"+ New Goal"** button
2. Enter your goal title and press Enter or click **Create**
3. The goal will appear in your goals list with default settings:
   - Category: Personal
   - Priority: Medium
   - Status: Not Started
   - Default 3 milestones

### Updating Progress

1. Click on a goal card to expand it
2. Use the progress slider to update completion percentage
3. Progress updates in real-time with visual feedback

### Managing Milestones

1. Expand a goal card
2. Check off completed milestones
3. Completed milestones are marked with strikethrough
4. Progress calculation can be linked to milestone completion

### Viewing Analytics

- **Progress Overview Chart**: Bar chart showing progress for each goal
- **Category Breakdown**: Pie chart visualizing goal distribution by category
- **AI Coaching Insight**: Dynamic suggestions based on your goal data

### Deleting a Goal

1. Expand the goal card
2. Click the red **"Delete Goal"** button at the bottom
3. Goal is removed permanently (consider archiving in future versions)

## 🎨 Design System

### Color Palette
- **Primary Gradient**: Purple (#667eea) to Indigo (#764ba2)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)
- **Danger**: #ef4444 (Red)
- **Info**: #3b82f6 (Blue)

### Category Colors
- **Business**: #3b82f6 (Blue)
- **Learning**: #8b5cf6 (Purple)
- **Health**: #ec4899 (Pink)
- **Personal**: #14b8a6 (Teal)
- **Finance**: #f97316 (Orange)

### Typography
- **Headings**: Bold, sized appropriately (24px h1, 20px h2, 18px h3)
- **Body**: Regular 14-16px
- **Labels**: Small 12-13px, slightly muted color

## 🔧 Configuration

### Customizing Categories

Edit `src/utils/constants.js`:

```javascript
export const CATEGORIES = ['Business', 'Learning', 'Health', 'Personal', 'Finance', 'Relationships'];
```

### Customizing Colors

Edit `src/utils/constants.js`:

```javascript
export const COLORS = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#10b981',
  // ... category colors
};
```

### Customizing Default Milestones

Edit `src/utils/constants.js`:

```javascript
export const DEFAULT_MILESTONES = [
  { title: 'Get Started', completed: false },
  { title: 'Build Momentum', completed: false },
  { title: 'Finish Strong', completed: false }
];
```

## 💾 Data Persistence

Goals are automatically saved to browser's `localStorage` under the key `visionflow_goals`. 

**Note**: Data is stored locally and will be lost if browser data is cleared. For production, implement a backend database.

## 🤖 AI Coaching System

The current AI insights are rule-based and generated from goal metrics:

- Progress-based insights
- Priority-based suggestions
- Category-focused tips
- Completion rate feedback

**Future Enhancement**: Integrate with Claude API for dynamic, context-aware insights.

## 📱 Responsive Design

The application is fully responsive:
- **Desktop**: Full width layout with side-by-side charts
- **Tablet**: Stacked layout with optimized spacing
- **Mobile**: Single column, touch-friendly buttons and inputs

## 🔐 Security Considerations

- Currently stores data only in browser localStorage
- No backend authentication required for local use
- For production deployment:
  - Implement user authentication (OAuth, JWT)
  - Use secure backend API
  - Encrypt sensitive goal data
  - Implement proper error handling

## 📈 Future Enhancements

### Phase 2
- [ ] User authentication and multi-device sync
- [ ] Cloud storage for goal data
- [ ] Goal templates and quickstart options
- [ ] Recurring goals support
- [ ] Goal collaboration/sharing

### Phase 3
- [ ] Advanced analytics and trending
- [ ] Time-series progress visualization
- [ ] Goal dependencies and relationships
- [ ] Habit integration
- [ ] Social features (team goals, leaderboards)

### Phase 4
- [ ] Claude API integration for truly intelligent coaching
- [ ] Natural language goal creation
- [ ] Predictive analytics
- [ ] Smart reminders and notifications
- [ ] Personalized learning paths

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Test Files Location
Tests are colocated with components: `ComponentName.test.jsx`

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build
npm run build

# Netlify deploy (connect your repo on netlify.com)
# Or use Netlify CLI
npm i -g netlify-cli
netlify deploy --prod --dir=build
```

### Environment Variables

Create `.env.local`:

```
REACT_APP_API_URL=your_api_url
REACT_APP_AI_COACHING_ENABLED=true
```

## 🐛 Known Issues

- AI insights are rule-based, not truly intelligent
- No backend integration yet (local storage only)
- Mobile responsiveness could be improved for very small screens
- No dark mode support in current version

## 📝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Use ES6+ syntax
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes

## 📄 License

This project is licensed under the MIT License - see LICENSE.md for details.

## 👥 Authors

- **Guskolx** - Initial concept and design
- **Contributors** - Community improvements

## 🙏 Acknowledgments

- Recharts for beautiful data visualizations
- React community for amazing tools and libraries
- Our users for inspiration and feedback

## 📞 Support

- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Share ideas in GitHub Discussions
- **Email**: support@visionflow.app

## 🎯 Project Goals

- Make goal achievement accessible to everyone
- Provide intelligent, personalized coaching
- Create a beautiful, intuitive user experience
- Build a supportive community
- Enable users to reach their full potential

---

**Last Updated**: December 2024
**Version**: 2.0.0
**Status**: Active Development 🚀
