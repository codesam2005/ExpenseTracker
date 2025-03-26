// AWS Configuration
AWS.config.update({
    accessKeyId: '',  // Replace with your AWS Access Key
    secretAccessKey: '',  // Replace with your AWS Secret Key
    region: 'us-east-1' // Change to your AWS region
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const topicArn = "";  // Replace with your SNS Topic ARN

const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");

// Toggle custom category input
function toggleCustomCategory() {
    const categorySelect = document.getElementById("category");
    const customCategoryInput = document.getElementById("customCategory");

    if (categorySelect.value === "Other") {
        customCategoryInput.style.display = "block";
        customCategoryInput.setAttribute("required", "true");
    } else {
        customCategoryInput.style.display = "none";
        customCategoryInput.removeAttribute("required");
        customCategoryInput.value = ""; // Reset input field
    }
}

// Set Budget in DynamoDB
function setBudget() {
    const budget = document.getElementById("budget").value;
    if (!budget || budget <= 0) {
        alert("Please enter a valid budget.");
        return;
    }

    const params = {
        TableName: 'BudgetTable',
        Item: {
            "UserID": "123",
            "budget": budget
        }
    };

    dynamodb.put(params, function (err) {
        if (err) {
            console.error("Error setting budget:", err);
            alert("Failed to save budget.");
        } else {
            alert("Budget set successfully!");
            checkBudget();
        }
    });
}

// Fetch Budget from DynamoDB
async function fetchBudget() {
    const params = { TableName: "BudgetTable", Key: { "UserID": "123" } };
    try {
        const data = await dynamodb.get(params).promise();
        return data.Item ? parseFloat(data.Item.budget) : 0;
    } catch (error) {
        console.error("Error fetching budget:", error);
        return 0;
    }
}

// Fetch Expenses from DynamoDB
async function fetchExpenses() {
    const params = { TableName: 'Expenses' };

    try {
        const data = await dynamodb.scan(params).promise();
        renderExpenses(data.Items);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        alert("Failed to load expenses.");
    }
}

// Render Expenses in the Table
function renderExpenses(expenses) {
    expenseList.innerHTML = "";

    expenses.forEach(expense => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${expense.date}</td>
            <td>₹${expense.amount}</td>
            <td>${expense.category}</td>
            <td><button onclick="deleteExpense('${expense.ExpenseID}')">Delete</button></td>
        `;
        expenseList.appendChild(row);
    });
}

// Calculate Total Expenses
async function calculateTotalExpenses() {
    const params = { TableName: "Expenses" };
    try {
        const data = await dynamodb.scan(params).promise();
        const expenses = data.Items;
        const currentMonth = new Date().getMonth();
        let totalSpent = 0;

        expenses.forEach(expense => {
            const expenseMonth = new Date(expense.date).getMonth();
            if (expenseMonth === currentMonth) {
                totalSpent += parseFloat(expense.amount);
            }
        });

        return totalSpent;
    } catch (error) {
        console.error("Error calculating total expenses:", error);
        return 0;
    }
}

// Check Budget & Trigger SNS Alert
async function checkBudget() {
    const budget = await fetchBudget();
    const totalSpent = await calculateTotalExpenses();
    document.getElementById("budgetStatus").innerText = `Total Spent: ₹${totalSpent} / Budget: ₹${budget}`;

    if (totalSpent > budget) {
        alert("⚠️ Budget Limit Exceeded! Sending SMS alert...");
        sendSNSAlert(totalSpent, budget);
    }
}

// Send AWS SNS Alert
// Instantiate SNS before using it

function sendSNSAlert(totalSpent, budget) {
    const params = {
        Message: `⚠️ Alert! Your expenses (₹${totalSpent}) have exceeded the budget (₹${budget}).`,
        TopicArn: topicArn
    };

    sns.publish(params, function (err, data) {
        if (err) {
            console.error("Error sending SNS alert:", err);
        } else {
            console.log("SNS Alert sent successfully!", data);
        }
    });
}

async function deleteExpense(expenseID) {
    const params = {
        TableName: 'Expenses',
        Key: { "ExpenseID": expenseID }
    };

    try {
        await dynamodb.delete(params).promise();
        alert("Expense deleted successfully!");
        fetchExpenses(); // Refresh the list
        checkBudget();  // Recalculate budget after deleting an expense
    } catch (error) {
        console.error("Error deleting expense:", error);
        alert("Failed to delete expense.");
    }
}

// Add Expense to DynamoDB
async function addExpense(date, amount, category) {
    if (!date || !amount || !category) {
        alert("Please fill out all fields.");
        return;
    }

    const expenseID = Date.now().toString();
    const params = {
        TableName: 'Expenses',
        Item: {
            "ExpenseID": expenseID,
            "date": date,
            "amount": amount,
            "category": category
        }
    };

    try {
        await dynamodb.put(params).promise();
        alert("Expense added successfully!");
        fetchExpenses();
        checkBudget();
        expenseForm.reset();
    } catch (error) {
        console.error("Error adding expense:", error);
        alert("Failed to add expense.");
    }
}

// Handle Form Submission
expenseForm.addEventListener("submit", function (e) {
    e.preventDefault();
    
    const date = document.getElementById("date").value;
    const amount = document.getElementById("amount").value;
    
    let category = document.getElementById("category").value;
    if (category === "Other") {
        category = document.getElementById("customCategory").value.trim();
    }

    addExpense(date, amount, category);
});

// Load Expenses and Budget on Page Load
fetchExpenses();
window.onload = checkBudget;
