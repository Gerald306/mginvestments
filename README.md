# MG Education Services Platform 🎓

Welcome to MG Education Services, a comprehensive platform connecting teachers with schools across Uganda.

## 🌟 Features

- **Teacher Registration & Profiles**: Complete teacher management system
- **School Portal**: Advanced school registration and management
- **Job Posting System**: Seamless job creation and application process
- **Real-time Notifications**: Instant updates for all users
- **Mobile App**: Native mobile experience with React Native + Expo
- **Payment Integration**: MTN MoMo mobile money payments
- **Secure Authentication**: Firebase-powered user management

## 🚀 Technology Stack

- **Web Frontend**: React + TypeScript + Tailwind CSS
- **Mobile App**: React Native + Expo SDK 53
- **Backend**: Node.js + Express
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Payments**: MTN MoMo API Integration
- **Hosting**: Firebase Hosting

## 📁 Project Structure

This project has been organized for better maintainability:

```
📦 Project Root
├── 🌐 src/                    # Web application
├── 📱 mobile-app/             # React Native mobile app
├── 🔧 backend/                # Express.js API server
├── 🤝 shared/                 # Shared code between web & mobile
├── 🧪 tests/                  # All test files organized
├── 📚 docs/                   # Comprehensive documentation
└── ⚙️ Configuration files
```

For detailed structure information, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## 🚀 Quick Start

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

## 📚 Documentation

**Setup Guides:**
- [Firebase Setup](./docs/setup/FIREBASE_SETUP.md)
- [Production Deployment](./docs/setup/PRODUCTION-SETUP-GUIDE.md)
- [Responsive Design](./docs/setup/RESPONSIVE_DESIGN.md)

**API Integration:**
- [Payment Integration](./docs/api/PAYMENT-INTEGRATION-GUIDE.md)
- [MTN MoMo Setup](./docs/api/MTN-MOMO-SETUP-GUIDE.md)
- [Teacher Credit System](./docs/api/TEACHER-CREDIT-SYSTEM-SUMMARY.md)

**Mobile Development:**
- [Android Setup](./docs/mobile/ANDROID_SETUP.md)

## 🧪 Testing

All tests are organized in the `tests/` directory:
- **Backend Tests**: `tests/backend/`
- **Frontend Tests**: `tests/frontend/`
- **Integration Tests**: `tests/integration/`

## 🔧 Available Scripts

**Web Application:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Mobile Application:**
- `cd mobile-app && npx expo start` - Start Expo development server
- `cd mobile-app && npx expo build` - Build mobile app

**Backend Services:**
- `cd backend && npm start` - Start API server
- `cd backend && npm run dev` - Start with nodemon

## 🤝 Contributing

We welcome contributions! The project structure has been cleaned and organized for easier development:

1. **Web development**: Work in the `src/` directory
2. **Mobile development**: Work in the `mobile-app/` directory
3. **Backend development**: Work in the `backend/` directory
4. **Shared code**: Use the `shared/` directory for reusable components
5. **Documentation**: Update relevant files in the `docs/` directory

## 📄 License

This project is licensed under the MIT License.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/6ee5b1d7-62b1-402c-9b7e-4e6d859cd81b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
