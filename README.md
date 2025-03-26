# Expense Tracker

## 📌 Overview
The **Expense Tracker** is a web-based application designed to help users manage their monthly expenses, track spending against a set budget, and receive alerts when the budget is exceeded. This project integrates **AWS DynamoDB** for data storage and **AWS SNS** for real-time budget alerts.

## ✨ Features
- **Set and Manage Monthly Budget** – Store budget limits in AWS DynamoDB.
- **Track Expenses** – Add, view, and delete expenses dynamically.
- **Category Selection** – Choose from predefined categories or add a custom one.
- **Budget Monitoring** – Automatically calculates total spending for the month.
- **AWS SNS Alerts** – Sends an SMS notification if expenses exceed the budget.
- **AWS QuickSight Integration** – Analyzes expense data using **Amazon QuickSight** and **AWS Athena** to convert **DynamoDB** data for visualization.
- **User-Friendly Interface** – Simple and clean UI for easy navigation.

## 🏗️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** AWS SDK (JavaScript)
- **Database:** AWS DynamoDB
- **Data Analytics:** AWS QuickSight, AWS Athena
- **Notifications:** AWS SNS
- **Development Environment:** Visual Studio Code

## 🚀 Installation and Setup
### 1️⃣ Prerequisites
Before running the project, ensure you have:
- **Node.js** installed ([Download here](https://nodejs.org))
- **AWS Account** with configured IAM permissions
- **Visual Studio Code** installed ([Download here](https://code.visualstudio.com/))

### 2️⃣ Clone the Repository
```sh
 git clone https://github.com/your-username/expense-tracker.git
 cd expense-tracker
```

### 3️⃣ Install Dependencies
```sh
npm install aws-sdk
```

### 4️⃣ Configure AWS Credentials
Edit the `script.js` file and replace the following placeholders with your **own AWS credentials**:
```js
AWS.config.update({
    accessKeyId: 'YOUR_ACCESS_KEY',  // Replace with your AWS Access Key
    secretAccessKey: 'YOUR_SECRET_KEY',  // Replace with your AWS Secret Key
    region: 'us-east-1' // Change to your AWS region
});
```
🚨 **Security Tip:** Never hardcode your AWS credentials. Use **IAM roles**, **AWS Cognito**, or environment variables for security.

### 5️⃣ Create Required AWS Services
You need to manually create the following AWS services before running the project:
- **DynamoDB Tables:**
  - `BudgetTable` with **UserID** (Partition Key) and **budget** (Number)
  - `Expenses` with **ExpenseID** (Partition Key), **date**, **amount**, and **category**
- **SNS Topic:** Create an SNS topic and subscribe your phone number to receive alerts.
- **AWS Athena & QuickSight:**
  - Configure **AWS Athena** to query **DynamoDB** data.
  - Set up **Amazon QuickSight** to visualize spending trends and budget insights.
- **IAM Permissions:** Ensure your IAM role has access to **DynamoDB**, **SNS**, **Athena**, and **QuickSight**.

### 6️⃣ Run the Project
Open **Visual Studio Code**, navigate to your project folder, and start a live server:
```sh
npx live-server
```
Then, open `http://localhost:8080` in your browser.

## 📬 Future Enhancements
🔹 User authentication with **AWS Cognito**  
🔹 More advanced analytics and reporting in **QuickSight**  
🔹 Voice assistant for adding expenses  

---
💡 **Contributors & Feedback:** Feel free to submit issues or pull requests if you have suggestions! 🚀

