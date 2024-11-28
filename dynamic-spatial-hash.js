/**
 * @fileoverview This is a dynamic spatial hash table implementation in JavaScript.
 * @module dynamic-spatial-hash
 *
 * @description The DynamicSpatialHash class is a dynamic spatial hash table implementation in JavaScript,
 * designed to be used for collision detection and querying nearby objects in a 2D space.
 *
 * @version 1.1.0
 * @license MIT
 *
 * @author Mark Vaaz
 * @see {@link https://github.com/markvaaz} GitHub
 */

export default class DynamicSpatialHash {
  #cellSize = 1 / 32;
  #table = new Map();

  /**
   * @param {number} cellSize
   * - The size in pixel of each cell in the hash table
   * - The smaller the number the more memory will be used, and the more cells to check for collisions (less efficient)
   * - The higher the number the less memory will be used, and the less cells to check for collisions, but the more objects will be in the same cell
   * - The default value is 32 px, and cannot be less than 1, although it is recommended to be a power of 2 (1, 2, 4, 8, 16, 32, 64, 128, 256, 512, ...)
   */
  constructor(cellSize = 32) {
    this.cellSize = cellSize;
    this.overflow = 0; // Adds a amount os extra cells that the object can be in
  }

  set cellSize(value) {
    if (typeof value !== 'number') throw new TypeError('cellSize must be a number');
    if (value <= 0) throw new RangeError('cellSize must be greater than 0');
    this.#cellSize = 1 / value;
  }

  get cellSize() {
    return this.#cellSize;
  }

  /**
   * @param {object} object
   * - The object to add to the hash table
   * - The object the __spatialHashes property will be added to the object
   * @description Adds a object to the hash table
   */
  add(object) {
    const hashes = this.getHashFromObject(object);

    object.__spatialHashes = hashes;

    hashes.forEach(hash => {
      if (!this.#table.has(hash)) this.#table.set(hash, new Set());
      this.#table.get(hash).add(object);
    });

    return this;
  }

  /**
   * @method delete - Deletes a  object from the hash table
   * @param {object} object
   * - The object to delete from the hash table
   * - The object must have been added to the hash table
   * - The object must have a __spatialHashes property
   */
  delete(object) {
    if (!object.__spatialHashes) return;
    object.__spatialHashes.forEach(hash => {
      if (!this.#table.has(hash)) return;

      this.#table.get(hash).delete(object);

      if (this.#table.get(hash).size === 0) this.clear(hash);
    });

    delete object.__spatialHashes;

    return this;
  }

  /**
   * @method get - Gets all the objects in a hash coordinate
   * @param {string} hash
   * - The hash coordinate to get the objects from
   * @returns {Set<object>}
   */
  get(hash) {
    return this.#table.get(hash);
  }

  /**
   * @method query - Queries all the objects that are in the same hashes as the  object
   * @param {object} object
   * - The  object to query the hash table with
   * - The  object must have been added to the hash table
   * - The  object must have a __spatialHashes property
   * @returns {Set<object>}
   * - A set of objects that are in the same hashes as the  object
   * @description Queries all the objects that are in the same hashes as the  object
   * - This is useful if you want to check for collisions
   * - This is useful if you want to check for nearby objects
   */
  query(object) {
    const hashes = object.__spatialHashes;
    const objects = new Set();

    hashes.forEach(hash => {
      if (!this.#table.has(hash)) return;
      this.#table.get(hash).forEach(otherobject => {
        if (object === otherobject) return;
        objects.add(otherobject)
      });
    });

    return objects;
  }

  /**
   * @method update - Updates a  object in the hash table
   * @param {object} object
   * - The  object to update in the hash table
   * @description Updates a  object in the hash table
   * - Removes the  object from the old hashes and adds it to the new hashes
   */
  update(object) {
    this.delete(object).add(object);
  }

  /**
   * @method clear - Clears a hash from the hash table
   * @param {string} hash
   * - The hash to clear from the hash table
   * @description Clears a hash from the hash table
   * - This is useful if you want to clear a hash without having to get the  object
   */
  clear(hash) {
    this.#table.delete(hash);
  }

  /**
   * @method clearAll - Clears all the hashes in the hash table
   * @description Clears all the hashes in the hash table
   */
  clearAll() {
    this.#table.clear();
  }

  /**
   * @method getHashFromobject - Gets the hashes coordinates that the  object is in
   * @param {object} object
   * - The object to get the hashes from
   * @returns {Set<string>}
   * - A set of hashes coordinates that the  object is in
   * @description Gets the hashes coordinates that the  object is in
   * - The hashes are in the format of 'x,y'
   */
  getHashFromObject(object) {
    const { x, y, width, height } = object;
    const hashes = new Set();
    const minX = Math.floor((x - width * 0.5) * this.#cellSize) - this.overflow;
    const minY = Math.floor((y - height * 0.5) * this.#cellSize) - this.overflow;
    const maxX = Math.floor((x + width * 0.5) * this.#cellSize) + this.overflow;
    const maxY = Math.floor((y + height * 0.5) * this.#cellSize) + this.overflow;

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        hashes.add(this.hash(x, y));
      }
    }

    return hashes;
  }

/**
 * @method hash - Creates a 32-bit hash from x and y coordinates
 * @param {number} x - The x coordinate
 * @param {number} y - The y coordinate
 * @returns {number} - A 32-bit integer hash representing the x, y coordinates
 */
  hash(x, y) {
    return ((x * 16777619) ^ (y * 16777619)) >>> 0;; // 32 bits hash
  }
}
