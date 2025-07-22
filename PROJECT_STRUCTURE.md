# MG Investments - Project Structure

## 📁 Directory Structure

```
📦 MG Investments
├── 🌐 **Web Application**
│   ├── src/                    # Main web application source
│   │   ├── components/         # React components
│   │   ├── pages/             # Application pages
│   │   ├── services/          # Business logic services
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility libraries
│   │   └── types/             # TypeScript type definitions
│   ├── public/                # Static assets
│   └── package.json           # Web app dependencies
│
├── 📱 **Mobile Application**
│   ├── mobile-app/            # React Native Expo app
│   │   ├── src/               # Mobile app source
│   │   │   ├── components/    # React Native components
│   │   │   ├── screens/       # Mobile screens
│   │   │   ├── navigation/    # Navigation configuration
│   │   │   └── services/      # Mobile-specific services
│   │   ├── android/           # Android-specific files
│   │   ├── assets/            # Mobile app assets
│   │   └── app.json           # Expo configuration
│
├── 🔧 **Backend Services**
│   ├── backend/               # Express.js API server
│   │   ├── routes/            # API route definitions
│   │   ├── utils/             # Backend utilities
│   │   └── server.js          # Main server file
│
├── 🤝 **Shared Resources**
│   ├── shared/                # Code shared between web and mobile
│   │   ├── contexts/          # React contexts
│   │   ├── types/             # Shared TypeScript types
│   │   └── utils/             # Shared utility functions
│
├── 🧪 **Testing**
│   ├── tests/                 # All test files organized
│   │   ├── backend/           # Backend API tests
│   │   ├── frontend/          # Web app tests
│   │   └── integration/       # Integration and E2E tests
│
├── 📚 **Documentation**
│   ├── docs/                  # Comprehensive documentation
│   │   ├── api/               # API and payment integration guides
│   │   ├── setup/             # Setup and configuration guides
│   │   └── mobile/            # Mobile development guides
│
├── 🔧 **Scripts & Utilities**
│   ├── scripts/               # Deployment and utility scripts
│   │   ├── check-firebase.cjs         # Firebase connection check
│   │   ├── deploy-rules.cjs           # Firestore rules deployment
│   │   └── database-setup-teacher-credits.sql  # Database setup
│
└── ⚙️ **Configuration**
    ├── .vscode/               # VS Code workspace settings
    ├── firebase.json          # Firebase configuration
    ├── tailwind.config.ts     # Tailwind CSS configuration
    └── tsconfig.json          # TypeScript configuration
```

## 🎯 Key Features

### Web Application
- **React + TypeScript** - Modern web development stack
- **Tailwind CSS** - Utility-first CSS framework
- **Firebase Integration** - Authentication and database
- **MTN MoMo Payment** - Mobile money integration
- **Real-time Updates** - Live data synchronization

### Mobile Application
- **Expo SDK 53** - React Native development platform
- **Cross-platform** - iOS and Android support
- **Shared Business Logic** - Reuses web app services
- **Native Performance** - Optimized mobile experience

### Backend Services
- **Express.js API** - RESTful API server
- **MTN MoMo Integration** - Payment processing
- **Firebase Admin** - Server-side Firebase operations
- **Security Features** - Authentication and authorization

## 🚀 Getting Started

### Web Application
```bash
npm install
npm run dev
```

### Mobile Application
```bash
cd mobile-app
npm install
npx expo start
```

### Backend Services
```bash
cd backend
npm install
npm start
```

## 📖 Documentation Links

- [Firebase Setup](./docs/setup/FIREBASE_SETUP.md)
- [Payment Integration](./docs/api/PAYMENT-INTEGRATION-GUIDE.md)
- [MTN MoMo Setup](./docs/api/MTN-MOMO-SETUP-GUIDE.md)
- [Android Development](./docs/mobile/ANDROID_SETUP.md)
- [Production Deployment](./docs/setup/PRODUCTION-SETUP-GUIDE.md)

## 🧪 Testing

Run tests from the `tests/` directory:
- **Backend Tests**: `tests/backend/`
- **Frontend Tests**: `tests/frontend/`
- **Integration Tests**: `tests/integration/`

## 🔧 Development Tools

- **VS Code** - Recommended IDE with configured tasks
- **TypeScript** - Type safety across all applications
- **ESLint** - Code linting and formatting
- **Git** - Version control with organized structure

## 📞 Support

For questions or issues, refer to the documentation in the `docs/` directory or check the test files in `tests/` for usage examples.
