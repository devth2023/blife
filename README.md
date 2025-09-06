# Blife Healthy - Production-Ready E-commerce Platform

This project is a robust, scalable, and user-friendly e-commerce platform designed to be deployed and connected to a real backend. It features a clean, modern architecture that separates the UI from the data layer, allowing for flexible deployment options.

## 🏛️ Core Architecture

The application's architecture is designed for real-world use, centered around a swappable data source mechanism. This allows developers to run the application in two modes:

1.  **Developer Mode (`LOCAL_STORAGE`):** The default mode. The application runs entirely on the frontend, using the browser's local storage for data persistence. This is perfect for quick setup, UI development, and feature testing without needing a database or backend server.
2.  **Production Mode (`API`):** When you're ready to deploy, you can switch the data source to 'API'. In this mode, the application will make `fetch` requests to your own backend endpoints. The entire UI is already wired up to work with this mode seamlessly.

## 🚀 Getting Started

1.  **Run the project:** Open `index.html`. The application will start in **Developer Mode** by default.
2.  **Explore:** You can use the application, create users, add products, and place orders. All data will be saved in your browser's local storage.

## 🔌 Connecting to Your Backend (Production Mode)

This is where the platform's flexibility shines. To connect to your own database and backend services, follow these steps:

### Step 1: Configure the Data Source

Open the `config.ts` file in the root directory. Change the `DATA_SOURCE` constant from `'LOCAL_STORAGE'` to `'API'`:

```typescript
// config.ts
export const DATA_SOURCE: 'LOCAL_STORAGE' | 'API' = 'API';
```

### Step 2: Implement Your API Endpoints

The application is now configured to make network requests. You need to implement the backend API endpoints that the application will call. All API logic is centralized in `services/api.ts`.

Open `services/api.ts` and locate the `else` blocks within each function. These are the placeholders where you should add your `fetch` calls.

**Example: Implementing `getProducts`**

Find the `getProducts` function in `services/api.ts`:

```typescript
// services/api.ts

// ... inside getProducts function
if (DATA_SOURCE === 'LOCAL_STORAGE') {
  // ... local storage logic
} else {
  // --- YOUR CODE GOES HERE ---
  // Replace this with a fetch call to your backend
  console.log("Fetching products from API...");
  // Example:
  // const response = await fetch('https://your-api.com/products');
  // const products = await response.json();
  // return products;
  
  // For now, it returns an empty array. You must implement this.
  return Promise.resolve([]); 
}
```

You must implement similar logic for all functions in `services/api.ts`, including:
-   `getProducts`, `addProduct`, `updateProduct`, `deleteProduct`
-   `getOrders`, `createOrder`, `updateOrderItemStatus`
-   `getUsers`, `updateUser`
-   `getStoreApplications`, `createStoreApplication`, `updateStoreApplicationStatus`, `updateStoreCustomization`
-   `getReviews`, `addReview`
-   ...and all other data-related functions.

### Step 3: Deploy

Once your backend is ready and the `services/api.ts` file is updated with your API endpoints, you can deploy the frontend application to any static hosting provider. The application will now function as a complete, production-ready system powered by your own data.
