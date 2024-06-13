# Link Shortener Project

This project is a Link Shortener web application built using Node.js, Express.js, MongoDB, and Vite. It enables users to shorten URLs using custom links and provides QR codes for each custom link. The application also tracks and displays the total number of views for each link on the user's profile page.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js installed
- npm (Node Package Manager) installed
- MongoDB Compass installed and running

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/link-shortener.git
    cd link-shortener
    ```

2. Navigate to the project directory:
    ```bash
    cd link-shortener
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Install Vite (for frontend development):
    ```bash
    npm install vite
    ```

5. Install Yup (for validation):
    ```bash
    npm install yup
    ```

6. Install MongoDB (for database storage):
    ```bash
    npm install mongoose
    ```

7. Install Multer (for handling file uploads):
    ```bash
    npm install multer
    ```

8. Install QRcode (for generating QR codes):
    ```bash
    npm install qrcode
    ```

9. Install Express Session (for managing user sessions):
    ```bash
    npm install express-session
    ```

## Usage

1. Open your browser and navigate to `http://localhost:5173` to view the application.
2. Register a new account or log in if you already have one.
3. Once logged in, you can create short links for URLs.
4. Click on the user icon to access your profile or log out.


## Development

- Start the Vite development server:
    ```bash
    npm run dev
    ```

- Start the Express server:
    ```bash
    npm run serve
    ```
