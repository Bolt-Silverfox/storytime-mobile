# Storytime Mobile

A React Native mobile application built with Expo and TypeScript.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Debugging](#debugging)
- [Common Issues](#common-issues)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or later) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Expo Go** app on your mobile device
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **Xcode** (for iOS development on macOS)
- **Android Studio** (for Android development)

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd storytime-mobile
```

2. Install dependencies:
```bash
npm install
```

## Running the App

### Development Mode

Start the Expo development server:

```bash
npm start
```

This will open the Expo DevTools in your browser. From here, you can:

- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator (macOS only)
- Press `w` to open in web browser
- Scan the QR code with Expo Go app on your physical device

### Platform-Specific Commands

```bash
# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run on Web
npm run web
```

## Project Structure

```
storytime-mobile/
├── assets/              # Images, fonts, and other static files
├── node_modules/        # Dependencies (generated)
├── App.tsx             # Main application component
├── app.json            # Expo configuration
├── index.ts            # Entry point
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo development server |
| `npm run android` | Run on Android device/emulator |
| `npm run ios` | Run on iOS simulator (macOS only) |
| `npm run web` | Run in web browser |

## Development

### TypeScript

This project uses TypeScript for type safety. The TypeScript configuration is in `tsconfig.json`.

### New React Architecture

This project has the New React Architecture enabled (`newArchEnabled: true`), which includes:
- **Fabric** - The new rendering system
- **TurboModules** - Improved native module system
- **Concurrent Features** - Better performance and UX

### Adding Dependencies

```bash
# Using npm
npm install <package-name>

# Using Expo CLI for Expo-compatible packages
npx expo install <package-name>
```

### Code Style

Consider adding ESLint and Prettier for consistent code formatting:

```bash
npx expo install -- --save-dev eslint prettier
```

## Building for Production

### Android (APK/AAB)

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android
```

### iOS (IPA)

```bash
# Build for iOS (requires macOS)
eas build --platform ios
```

### Publishing Updates

```bash
# Publish updates to Expo
eas update --branch production
```

## Debugging

### React Native Debugger

1. Install [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
2. Run the app in development mode
3. Shake your device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
4. Select "Debug with Chrome"

### Flipper

For advanced debugging, you can use [Flipper](https://fbflipper.com/):

```bash
npm install --save-dev react-native-flipper
```

### Console Logs

View logs in the terminal where you ran `npm start`, or use:

```bash
# View logs for Android
npx react-native log-android

# View logs for iOS
npx react-native log-ios
```

## Common Issues

### Metro Bundler Cache Issues

```bash
# Clear cache
npx expo start --clear
```

### Node Modules Issues

```bash
# Remove and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### iOS Pod Installation Issues (macOS)

```bash
cd ios
pod install
cd ..
```

### Port Already in Use

```bash
# Kill process on default port (8081)
lsof -ti:8081 | xargs kill
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write meaningful commit messages
- Follow TypeScript best practices
- Test on both iOS and Android before submitting PR
- Update documentation as needed

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This is a React Native application using Expo. For bare React Native projects without Expo, some commands and workflows may differ.
