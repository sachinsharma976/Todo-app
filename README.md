# Next.js Todo Application

## Overview
The Next.js Todo Application is a web-based task management tool built using Next.js, providing an intuitive interface for users to track and manage their daily tasks. It incorporates server-side rendering (SSR) for efficient data fetching and ensures a smooth user experience with authentication and real-time state management.

This application allows users to authenticate via NextAuth.js, view their specific todos, add new tasks, mark tasks as complete or pending, edit task details, and delete tasks. Additionally, a structured loading system is implemented to enhance the user experience during navigation and data fetching.

![Todo App Screenshot](/public/img/todo_sc.png)

## Features

### 1. Server-Side Rendering (SSR)
- The home page fetches and displays todos using SSR, ensuring fast initial load times and improved SEO.
- By using SSR, todos are pre-fetched before the page is rendered, eliminating unnecessary client-side requests.

### 2. Authentication
- **NextAuth.js** is used to provide secure user authentication.
- Users can sign in and access their specific tasks, ensuring a personalized experience.
- Authentication is globally managed, so users stay signed in across different pages.

### 3. State Management
- The application uses **Redux Toolkit (RTK Query)** to manage state and API calls efficiently.
- RTK Query simplifies data fetching, caching, and synchronization between the UI and backend.

### 4. UI Components
- Styled using **Tailwind CSS**, a utility-first CSS framework, ensuring a responsive and customizable design.
- Uses **@tanstack/react-table** to display todos in a structured table format with features like sorting and filtering.
- A **profile badge** is displayed in the navbar after authentication, allowing users to navigate to their todos or log out.

### 5. User-Specific Todo Management
- Users can:
  - View their assigned tasks.
  - Add new todos with a simple form.
  - Edit existing todos.
  - Mark todos as completed or pending.
  - Delete todos.
- **Client-Side Modifications:** Changes to todos are handled on the client-side, meaning they do not persist after a page refresh.

### 6. Loading States
- **Next.js’s `loading.js` file** is used to implement a loading screen during page transitions.
- This ensures users are provided with feedback while navigating the application.

### 7. Logout Handling
- Users can log out through the profile badge in the navbar.
- Upon logging out, they are redirected back to the sign-in page.

## Technologies Used

- **Next.js** (App Router, SSR)
- **NextAuth.js** (User authentication)
- **Redux Toolkit (RTK Query)** (State management and API calls)
- **Tailwind CSS** (Styling framework)
- **@tanstack/react-table** (Table UI with sorting and filtering)

## Getting Started

### Prerequisites
Before running the application, ensure that you have the following installed:
- **Node.js** (Version 16+ recommended)
- **pnpm** (Preferred package manager, but npm or yarn can also be used)

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/sachinsharma976/Todo-app.git
   cd Todo-app
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
   - Create a `.env.local` file in the root directory.
   - Add the following environment variables:
     ```env
     NEXTAUTH_URL=http://localhost:3000
     NEXTAUTH_SECRET=your_secret_key
     ```

### Running the Application
To start the development server, run:
```bash
pnpm dev
```
This will launch the application at `http://localhost:3000`.

## 🔐 Default User Credentials
These are the pre-configured users with their login details:

1. **John Doe**
   * Email: admin@example.com
   * Password: admin123

2. **Alice Smith**
   * Email: user1@example.com
   * Password: user123

3. **Bob Johnson**
   * Email: user2@example.com
   * Password: password123

4. **Emma Davis**
   * Email: user3@example.com
   * Password: securePass


## Usage Guide

1. **Home Page (SSR)**
   - Displays all todos fetched from `https://jsonplaceholder.typicode.com/todos`.
   - Read-only mode: Users cannot modify these todos.

2. **Authentication (Sign-In Page)**
   - Users can sign in using NextAuth.js.
   - After authentication, they are redirected to their user-specific todo page.

3. **User-Specific Todo Page**
   - Fetches todos filtered by `userId` of the authenticated user.
   - Users can **add, edit, mark as completed/pending, and delete todos**.

4. **Profile Badge & Logout**
   - Once authenticated, a profile badge appears in the navbar.
   - The profile badge provides options to **view todos** or **log out**.
   - Logging out redirects the user to the sign-in page.

## Folder Structure
```
app/               # Next.js app router
├── (auth)/        # Authentication pages
├── user/         # User-specific todo page
├── page.tsx          # Home page (read-only todos)
├── loading.tsx     # Loading screen for page transitions
└── layout.tsx      # Global layout
components/        # Reusable UI components
├── Navbar/        # Navbar with profile badge
├── Table/         # Table components for todos
└── SignInButton/  # Sign-in Button
└── ServerError/   # Server error component
└── TodoDialogs/   # Todo Dialogs for Adding, Editing, Deleting
└── ui/            # UI components
lib/               # Utility functions and services
├── store/         # Redux Toolkit store and services
├── auth.ts        # NextAuth.js configuration
└── utils.ts       # utility functions
```

## API Integration
- **Todos are fetched from:** `https://jsonplaceholder.typicode.com/todos`.
- **SSR (Server-Side Rendering) for Home Page:** Fetches and displays all todos before rendering.
- **Client-Side Fetching for User Todos:** Uses RTK Query to fetch todos specific to the authenticated user.

## Contributing
Want to contribute? Follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Implement your changes and commit:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push the branch:
   ```bash
   git push origin feature-branch
   ```
5. Open a pull request.

## License
This project is licensed under the MIT License.

## Contact
For any questions or feedback, feel free to reach out:
- **Email:** sachin.sharma.97659@gmail.com
- **GitHub:** [sachinsharma976](https://github.com/sachinsharma976)

## Additional Notes
- Ensure all dependencies are installed before running the project.
- Contributions and feature requests are welcome!

---

