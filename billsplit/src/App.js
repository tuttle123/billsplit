import React, { useState } from 'react';
import './App.css';

function App() {
  const [totalBill, setTotalBill] = useState('');
  const [numberOfFriends, setNumberOfFriends] = useState(1);
  const [tip, setTip] = useState(0);
  const [tax, setTax] = useState(0);
  const [orders, setOrders] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newCost, setNewCost] = useState('');
  const [newPerson, setNewPerson] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const calculateTotalWithTipAndTax = () => {
    const bill = parseFloat(totalBill) || 0;
    const tipAmount = bill * (parseFloat(tip) / 100);
    const taxAmount = parseFloat(tax) || 0;
    return bill + tipAmount + taxAmount;
  };

  // Add a new order with manual inputs for item, cost, and person
  const handleAddOrder = () => {
    const cost = parseFloat(newCost);
    if (newItem && !isNaN(cost) && cost > 0) {
      const newOrder = { item: newItem, cost: cost, person: newPerson };
      setOrders([...orders, newOrder]);
      setNewItem(''); // Clear input after adding
      setNewCost(''); // Clear input after adding
    } else {
      alert('Please enter a valid item name and cost.');
    }
  };

  const handleOrderChange = (index, field, value) => {
    const newOrders = [...orders];
    newOrders[index][field] = value;
    setOrders(newOrders);
  };

  const handleRemoveOrder = (index) => {
    const newOrders = orders.filter((_, i) => i !== index);
    setOrders(newOrders);
  };

  const calculatePerPersonAmount = () => {
    const totals = Array(numberOfFriends).fill(0);

    orders.forEach((order) => {
      const personIndex = parseInt(order.person, 10);
      if (!isNaN(personIndex) && personIndex < numberOfFriends && order.cost) {
        totals[personIndex] += parseFloat(order.cost);
      }
    });

    const totalBillWithExtras = calculateTotalWithTipAndTax();
    const subtotal = orders.reduce((acc, order) => acc + parseFloat(order.cost || 0), 0);

    const finalTotals = totals.map((total) => {
      const proportionalTaxAndTip = (total / subtotal) * (totalBillWithExtras - subtotal);
      return (total + proportionalTaxAndTip).toFixed(2);
    });

    return finalTotals;
  };

  const handleSubmit = () => {
    if (orders.some(order => order.cost <= 0)) {
      setErrorMessage('Please enter valid costs for all orders.');
      return;
    }
    setErrorMessage('');
  };

  return (
    <div className="App">
      <h1>Bill Splitter with Manual Item Entry</h1>

      <div>
        <label>Total Bill (Before Tip and Tax): $</label>
        <input
          type="number"
          value={totalBill}
          onChange={(e) => setTotalBill(e.target.value)}
          placeholder="Enter total bill"
        />
      </div>

      <div>
        <label>Tip (%): </label>
        <input
          type="number"
          value={tip}
          onChange={(e) => setTip(e.target.value)}
          placeholder="Enter tip percentage"
        />
      </div>

      <div>
        <label>Tax ($): </label>
        <input
          type="number"
          value={tax}
          onChange={(e) => setTax(e.target.value)}
          placeholder="Enter tax amount"
        />
      </div>

      <div>
        <label>Number of Friends: </label>
        <input
          type="number"
          value={numberOfFriends}
          onChange={(e) => setNumberOfFriends(e.target.value)}
          min="1"
        />
      </div>

      <div>
        <h3>Add New Order</h3>
        <label>Item Name: </label>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Enter item name"
        />
        <label>Cost: $</label>
        <input
          type="number"
          value={newCost}
          onChange={(e) => setNewCost(e.target.value)}
          placeholder="Enter item cost"
        />
        <label>Assigned to Friend: </label>
        <select value={newPerson} onChange={(e) => setNewPerson(e.target.value)}>
          {Array.from({ length: numberOfFriends }, (_, i) => (
            <option key={i} value={i}>
              Friend {i + 1}
            </option>
          ))}
        </select>
        <button onClick={handleAddOrder}>Add to Order</button>
      </div>

      <div>
        <h3>Orders</h3>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index}>
              <label>Item {index + 1}: {order.item} </label>
              <label> Cost: ${order.cost.toFixed(2)} </label>
              <label> Assigned to Friend: </label>
              <select
                value={order.person}
                onChange={(e) => handleOrderChange(index, 'person', e.target.value)}
              >
                {Array.from({ length: numberOfFriends }, (_, i) => (
                  <option key={i} value={i}>
                    Friend {i + 1}
                  </option>
                ))}
              </select>
              <button onClick={() => handleRemoveOrder(index)}>Remove</button>
            </div>
          ))
        ) : (
          <p>No orders added yet.</p>
        )}
      </div>

      <button onClick={handleSubmit}>Calculate</button>

      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}

export default App;
