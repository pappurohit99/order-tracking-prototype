# Order Tracking Dashboard

A modern order tracking system with real-time map visualization, order modification capabilities, and support features. Built with Node.js, Express, and Leaflet maps.

## Features
- Live order tracking with map integration
- Order modification and rescheduling
- Support ticket system
- Order cancellation workflow
- Delivery insights dashboard

## Setup Instructions

### Windows
Install Node.js from [nodejs.org](https://nodejs.org)

### macOS
Install Node.js using Homebrew:
```bash
brew install node
```

### Linux (Ubuntu/Debian)
Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Running the Project
1. Clone the repository
```bash
git clone https://github.com/pappurohit99/order-tracking-prototype.git
```

2. Navigate to project directory
```bash
cd order-tracking-prototype
```

3. Install dependencies
```bash
npm install
```
4. Prepare the database for a fresh session
```bash
npm run seed
```

5. Start the server
```bash
npm start
```
6. Open your browser and visit:
```
http://localhost:3000
```

## Technologies Used
- Node.js
- Express
- Leaflet Maps
- Bootstrap 5
- JavaScript