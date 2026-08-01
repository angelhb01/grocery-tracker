## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Where I got my data
https://universe.roboflow.com/wei-tq4ff/grocery-detection-vud86

Food detection is limited due to imbalance and limited data across categories.

## Production URL

Below is the final production app that's ran in the web

Production URL: https://grocery-tracker.expo.app/

## Current issue with food detection
Due to limited memory in my hosting provider, the model may be able to collect user input depending on memory usage, so it may or may not work. Also, interacting with the database may not work. I would have to re-enable the database once every week since I'm not using a paid subscription.
