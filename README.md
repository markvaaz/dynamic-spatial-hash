# Dynamic Spatial Hash

The DynamicSpatialHash class is a dynamic spatial hash table implementation in JavaScript, designed to be used for collision detection and querying nearby objects in a 2D space. The hash table is dynamically resizable, allowing objects to be added, deleted, and updated even in negative coordinates.

Features:

- Efficient collision detection: The DynamicSpatialHash class uses a hash table data structure to provide fast and efficient collision detection for objects in a 2D space.
- Dynamic resizing: The hash table is dynamically resizable, allowing objects to be added, deleted, and updated even in negative coordinates.
- Customizable cell size: The size of each cell in the hash table can be customized, allowing you to balance memory usage and collision detection efficiency based on your specific use case.
- Easy to modify for your needs: The DynamicSpatialHash class is designed to be easily modified for your specific needs, allowing you to add custom methods for your use case. For eg. you can modify the `getHashForObject` to deconstruct your object based on your object structure.
- Querying nearby objects: The DynamicSpatialHash class provides a method for querying nearby objects that are in the same hash cells as a given object, allowing you to efficiently find nearby objects for various use cases.
- Easy to use: The DynamicSpatialHash class provides simple and easy-to-use methods for adding, deleting, updating, and querying objects in the hash table.

# Properties:

- `cellSize`: The size of each cell in the hash table. The default value is 128 pixels.
- `overflow`: Adds a amount os extra cells that the object can be in around the object. The default value is 0.
- `#table`: The hash table data structure mapping hash cell coordinates to objects.
- `#cellSize`: The inverted size of the hash table cells, for performance reasons.

# Methods:

- `add(object)`: Adds an object to the hash table.
- `delete(object)`: Deletes an object from the hash table.
- `update(object)`: Updates an object in the hash table, by deleting it and then adding it again.
- `query(object)`: Queries nearby objects for the given object.
- `clear(hash)`: Clears the hash cell at the given coordinates.
- `clearAll()`: Clears the entire hash table.
- `getHashForObject(object)`: Returns a set of hash cell coordinates for the given object.

# Usage:
To use the DynamicSpatialHash class in your JavaScript application, simply import the class and create a new instance with an optional cell size parameter. You can then use the provided methods to add, delete, update, query, and clear objects in the hash table.

Example usage:

```javascript
import DynamicSpatialHash from 'dynamic-spatial-hash';

// Create a new instance of DynamicSpatialHash with a cell size of 128 pixels
const hashTable = new DynamicSpatialHash(128);

// Add an object to the hash table
const object = { x: 10, y: 20, width: 32, height: 32 };
hashTable.add(object);

// Update an object in the hash table
object.x = 20;
hashTable.update(object);

// Query nearby objects for collision detection
const nearbyObjects = hashTable.query(object);

// Delete an object from the hash table
hashTable.delete(object);

// Clear the hash cell at the coordinates (0, 0)
hashTable.clear(`0,0`);

// Clear the entire hash table
hashTable.clearAll();

// Query nearby objects
hashTable.query(object); // Returns a set of nearby objects
```
# Test Run with 1000 Objects on a 1920x1080 Screen

| Cell Size & Execution time | 16px | 32px | 64px | 128px | 256px | 512px |
| ------------------------- | ---- | ---- | ---- | ----- | ----- | ----- |
| Query non client object   | 22ms | 7ms  | 4ms  | 4ms   | 5ms   | 10ms  |
| Query client object       | 22ms | 6ms  | 4ms  | 4ms   | 5ms   | 13ms  |
| Update                    | 16ms | 3ms  | 1ms  | <1ms   | <1ms   | 1ms   |

