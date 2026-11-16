# Voicy

Voicy is a cross-platform mobile chat application built with **React Native and Expo**, supported by a **Java backend using Hibernate** and deployed on **GlassFish**.

The repository contains the mobile application at the project root and the Java web application in `backend/VoicyApp`. The backend is a **NetBeans Ant project**; it is not a Maven or Gradle project.

## Tech Stack

### Mobile application

- React Native
- Expo
- TypeScript
- Node.js and npm

### Backend

- Java
- Hibernate ORM
- Apache Ant build system
- NetBeans project configuration
- GlassFish application server
- Java web application (WAR deployment)

> Add the exact database, Java version, authentication method, and real-time communication details here if you want to document those implementation choices.

## Project Features

Voicy is intended to provide a mobile messaging experience with a separate Java backend.

Document only the features that are currently implemented in your version. For example, you can list account registration and login, conversations, message history, real-time messaging, image sharing, profile management, or online presence where applicable.

## Project Structure

```text
Voicy-Chat-App/
│
├── assets/                         # Expo app assets
│
├── src/                            # Mobile application source
│   ├── api/                        # Backend API integration
│   ├── components/                 # Reusable UI components
│   ├── screens/                    # Application screens
│   ├── socket/                     # Socket communication
│   ├── theme/                      # Colors and theme configuration
│   └── util/                       # Helper functions and utilities
│
├── backend/
│   └── VoicyApp/                   # Java Hibernate web application
│       ├── lib/                    # Required Java libraries
│       ├── nbproject/              # NetBeans Ant project configuration
│       ├── src/
│       │   ├── conf/               # Application configuration
│       │   └── java/               # Java source code
│       ├── web/
│       │   ├── WEB-INF/            # Web application configuration
│       │   ├── ImageFile/          # Image resources or uploads
│       │   ├── profile-images/     # Profile image resources or uploads
│       │   └── index.html          # Web application entry page
│       └── build.xml               # Apache Ant build file
│
├── App.tsx                         # Main Expo application component
├── app.json                        # Expo configuration
├── index.ts                        # Application entry point
├── package.json                    # npm dependencies and scripts
├── package-lock.json               # Locked npm dependency versions
├── tsconfig.json                   # TypeScript configuration
├── .gitignore                      # Git ignore rules
└── README.md                       # Project documentation
```

Generated folders such as `node_modules/` and `backend/VoicyApp/build/` are not committed to the repository.

## Prerequisites

Install the following tools:

- Node.js version compatible with the Expo SDK used by this project
- npm
- Java JDK compatible with your GlassFish version
- Apache Ant
- GlassFish Server
- Expo Go or an Android/iOS development environment

You can check your local installations with:

```bash
node --version
npm --version
java -version
ant -version
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Sandakelum000/Voicy-Chat-App---ReactNative.git
cd Voicy-Chat-App---ReactNative
```

### 2. Set up and run the Java backend

The backend is a **NetBeans Java Ant web application** located in `backend/VoicyApp`.

Move into the backend project directory:

```bash
cd backend/VoicyApp
```

Build the project using Ant:

```bash
ant
```

To see the build targets defined by the project:

```bash
ant -p
```

The Ant build generates the web application archive (WAR) and other build output. The generated output is kept out of Git.

Deploy the generated WAR to your configured GlassFish domain. You can deploy it through the NetBeans GlassFish integration, or use the GlassFish `asadmin` command with the actual WAR path produced by your build:

```bash
asadmin deploy path/to/generated-application.war
```

If the application is already deployed and you are redeploying it, use the appropriate redeploy option supported by your GlassFish version.

**Backend configuration:** Check `src/conf/hibernate.cfg.xml` and configure the database connection for your local environment. Do not commit real database passwords or other credentials. The database must be available before the backend can use it.

> The exact WAR filename, context root, database name, and GlassFish domain settings depend on your local project configuration. Check the Ant output and `web/WEB-INF/glassfish-web.xml` for the values used by your application.

### 3. Set up and run the Expo mobile app

From the repository root, open a new terminal and install the dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

Follow the Expo CLI instructions to open the application in Expo Go, an Android emulator, or an iOS simulator.

### 4. Configure the backend URL

Make sure the mobile app's API configuration points to an address reachable from the device.

- For an Android emulator, the host machine may be reachable through the emulator's special host address.
- For a physical phone, use your computer's local network IP address and ensure both devices are on a network that allows them to communicate.
- `localhost` on a physical phone refers to the phone itself, not your development computer.

Update the API base URL in the location used by your app (for example, the relevant configuration in `src/api/`). Do not place private server credentials in the mobile application.

## Development Notes

- Run the backend on GlassFish and the mobile app through Expo.
- Keep the API base URL and backend context root aligned.
- Ensure the database connection is configured for the local environment.
- Keep required third-party Java libraries in `backend/VoicyApp/lib/` if the Ant project depends on them.
- Do not commit generated build output, `node_modules/`, local environment files, passwords, tokens, or private keys.
- Use a reachable backend address when testing on a physical device.

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m "Describe your change"`.
4. Push the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## License

No license has been specified yet. Add a `LICENSE` file if you intend to grant others permission to use, modify, and distribute this project.

---

**Voicy** — A mobile chat application built with React Native, Expo, Java, Hibernate, and GlassFish.
