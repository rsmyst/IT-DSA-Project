# Food Court Token System

This project is a Food Court Token System, designed to manage and prioritize food orders efficiently. It was developed as a submission for a Data Structures and Algorithms (DSA) course project.

## Description

The Food Court Token System allows users to add, dequeue, and clear food orders. Each order is assigned a preparation time and a timestamp, which are used to prioritize the orders. The system ensures that orders with shorter preparation times are processed first, and in case of a tie, the order that was placed earlier is given priority.

## Features

- **Add Order**: Users can add a new order by entering the order name and selecting the category, which determines the preparation time.
- **Dequeue Order**: The highest priority order (based on preparation time and timestamp) is removed from the queue.
- **Clear Queue**: All orders are removed from the queue.
- **Order Display**: The current queue of orders is displayed, showing the order name, category, and preparation time.

## Data Structures and Algorithms

### Data Structures

- **Array**: The 

orderQueue

 is implemented as an array to store the list of orders.

### Algorithms

- **Sorting**: The 

updateQueue

 function sorts the orders based on preparation time and timestamp using a custom comparator function.
- **Priority Queue**: The sorting mechanism effectively implements a priority queue, where orders with shorter preparation times and earlier timestamps are given higher priority.

## Code Overview

### 

script.js



- **

addOrder

**: Adds a new order to the queue and updates the display.
- **

dequeueOrder

**: Removes the highest priority order from the queue and updates the display.
- **

clearQueue

**: Clears all orders from the queue and updates the display.
- **

updateQueue

**: Sorts the orders and updates the display.

### 

styles.css



- Contains the styling for the application, including the layout and appearance of the order items and buttons.

### 

index.html



- The main HTML file that includes the structure of the application and links to the JavaScript and CSS files.

## Deployment

The application is deployed at [https://fctoken.netlify.app/](https://fctoken.netlify.app/).

## Usage

1. Open the application in a web browser.
2. Enter the order name and select the category.
3. Click "Add Order" to add the order to the queue.
4. Click "Dequeue Order" to remove the highest priority order from the queue.
5. Click "Clear Queue" to remove all orders from the queue.

## Conclusion

This project demonstrates the use of basic data structures and algorithms to manage and prioritize food orders in a food court setting. It showcases the practical application of sorting and priority queues in a real-world scenario.
