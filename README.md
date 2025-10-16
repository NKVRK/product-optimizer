# AI-Powered Amazon Product Listing Optimizer

This full-stack web application leverages the power of generative AI to help Amazon sellers optimize their product listings. By providing an Amazon Standard Identification Number (ASIN), users can automatically fetch existing product details, generate enhanced content, and store a complete history of all optimizations.

## Key Features ✨

* **Automated Data Fetching**: Enter any Amazon ASIN to instantly pull the current product title, description, and feature bullet points using an intelligent web scraping service.
* **AI-Powered Content Generation**: Utilizes Google's Gemini AI to generate highly-optimized and persuasive content, including:
    * **SEO-Friendly Titles**: Crafted to improve search visibility and click-through rates.
    * **Engaging Descriptions**: Rewritten to be more compelling and informative for customers.
    * **Clear Feature Bullets**: Restructured for better readability and impact.
    * **Strategic Keywords**: A list of suggested keywords to enhance search rankings.
* **Side-by-Side Comparison**: A clean and intuitive user interface that displays the original and AI-optimized product listings next to each other, making it easy to see the improvements.
* **Optimization History**: All optimization runs are saved to a MySQL database, allowing users to track changes over time for any ASIN.
* **Modern, Responsive UI**: Built with React and Material-UI, the application features a sleek, modern design with a dark mode toggle for user comfort.

## Pros of this Application 🚀

* **Improved SEO and Visibility**: The AI-generated titles and keywords are designed to help products rank higher in Amazon's search results.
* **Increased Conversion Rates**: Persuasive and clear product descriptions and features can lead to higher sales and better customer engagement.
* **Time and Cost Savings**: Automates the time-consuming process of manually writing and optimizing product listings.
* **Data-Driven Decisions**: By tracking optimization history, sellers can analyze which changes are most effective over time.

## Tech Stack 🛠️

| Category      | Technology                                                                                                                                                              |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black) ![Material--UI](https://img.shields.io/badge/Material--UI-0081CB?logo=mui&logoColor=white) ![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)                                                                                   |
| **Database** | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)                                                                                            |
| **AI & Scraping** | ![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B9?logo=google&logoColor=white) **Apify** |

## Setup and Installation

To get this project up and running locally, please follow these steps.

### Prerequisites

Make sure you have the following software installed on your machine:

* [Node.js](https://nodejs.org/) (v14 or later)
* [MySQL](https://www.mysql.com/downloads/) or another MySQL-compatible database (e.g., MariaDB).

---

### 1. Backend Setup

First, set up the Node.js server and connect it to your database.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/product-optimizer.git](https://github.com/your-username/product-optimizer.git)
    cd product-optimizer/backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the database:**
    * Log in to your MySQL server and create a new database.
        ```sql
        CREATE DATABASE product_optimization;
        ```

4.  **Create the environment file:**
    * Create a new file named `.env` in the `backend` directory.
    * Copy the contents of `.env.example` into it and fill in your database credentials and API keys.
        ```env
        # --- Server Configuration ---
        NODE_ENV=development
        PORT=5000

        # --- Database Configuration ---
        DB_HOST=localhost
        DB_USER=your_db_user
        DB_PASSWORD=your_db_password
        DB_NAME=product_optimization

        # --- External API Keys ---
        GEMINI_API_KEY=your_gemini_api_key_here
        APIFY_API_TOKEN=your_apify_api_token_here

        # --- Frontend URL ---
        FRONTEND_URL=http://localhost:3000
        ```

5.  **Run the server:**
    * The database tables will be created automatically when the server starts for the first time.
    ```bash
    npm run dev
    ```
    The backend server should now be running on `http://localhost:5000`.

---

### Steps to Set Up Apify 🕷️

1.  **Create an Account**: First, go to the official Apify website ([https://apify.com/](https://apify.com/)) and create an account.

2.  **Go to Settings**: In the left menu, navigate to **"Settings"**. (It's the last item in the menu, so you may need to scroll to the bottom).

3.  **Find Your API Key**: Click on the **API** tab located in the top-right corner. You can create a new `API_KEY` here, but this is optional because a key is automatically generated when you sign up.

4.  **Go to the Apify Store**:
    * Click on **"Apify Store"** (the first item in the left menu).
    * Search for **"Amazon Products & Reviews - canadesk"**. You can also go directly to the page [here](https://console.apify.com/actors/allWTAqnk6LAtZ63v/input).

5.  **Start a Free Trial**: Click on the price dropdown menu and select the option to start a **free trial (1 day)**. This will be enough to test the application.


### 2. Frontend Setup

Next, set up the React client.

1.  **Navigate to the frontend directory:**
    ```bash
    # From the root project directory
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm start
    ```
    The React application should now be running and will open automatically in your browser at `http://localhost:3000`.

## AI Prompts and Reasoning

To ensure high-quality, structured output from the Gemini AI, a specific prompt engineering strategy was used. The AI is given a clear role, a detailed description of the input, and a strict JSON format for the output.

**Reasoning behind the prompt:**

1.  **Role-Playing**: Assigning the role of "an e-commerce optimization expert" puts the AI in the correct context to generate persuasive and relevant content.
2.  **Explicit Instructions**: The prompt clearly outlines the goal (improve conversion rates, maintain accuracy) and provides guidelines for each field (e.g., "Make the title more compelling and SEO-friendly").
3.  **Structured Output**: Requesting a specific JSON format is crucial. It makes the AI's response predictable and easy to parse on the backend, preventing errors and ensuring consistency in the data we store and display.

## Future Improvements 🔮

If given more time, the following features could be implemented to further enhance the application:

* **User Authentication**: Add user accounts to allow sellers to save and manage their own private list of optimized products.
* **Performance Analytics**: Integrate with Amazon's APIs to track how AI-driven changes affect a product's sales rank, views, and conversion rates over time.
* **A/B Testing**: Allow users to generate multiple optimized versions of a listing and provide tools to help them run A/B tests on Amazon.
* **Support for More Platforms**: Extend the application to support other e-commerce platforms like Shopify, Walmart, or eBay.
* **Batch Processing**: Allow users to upload a CSV file of ASINs to optimize multiple products at once.