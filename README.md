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
1. Install Node.js from [nodejs.org](https://nodejs.org)
2. Open Command Prompt and run:
```bash
npm install -g express
```

### macOS
1. Install Node.js using Homebrew:
```bash
brew install node
```
2. Install Express:
```bash
npm install -g express
```

### Linux (Ubuntu/Debian)
1. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```
2. Install Express:
```bash
npm install -g express
```

## Running the Project
1. Clone the repository
```bash
git clone https://github.com/yourusername/order-tracking-dashboard
```

2. Navigate to project directory
```bash
cd order-tracking-dashboard
```

3. Install dependencies
```bash
npm install
```

4. Start the server
```bash
npm start
```
5. Open your browser and visit:
```
http://localhost:3000
```

## Project Structure
```
order-tracking-dashboard/
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── server.js
└── README.md
```

## Technologies Used
- Node.js
- Express
- Leaflet Maps
- Bootstrap 5
- JavaScript