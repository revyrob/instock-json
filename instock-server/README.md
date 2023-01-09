#

> ### 1) install deps [ npm install ]

#

> ### 2) run the server [ npm run start ]

#

> ### 3) runs on port 8080

#

> ### Warehouse API

```
GET => http://localhost:8080/warehouse

Returns the list of all warehouses
```

```
GET => http://localhost:8080/warehouse/:id

Returns the list of one warehouse by id
```

```
GET => http://localhost:8080/warehouse/names

Returns the list of warehouse names
```

```
GET => http://localhost:8080/warehouse/:id/withinventory

UPDATED TUESDAY 10:30PM API:
Returns one warehouse by id + all the inventory items corresponding in an array
```

```
POST => http://localhost:8080/warehouse

Post a new warehouse item / object

```

```
PUT => http://localhost:8080/warehouse/:id

Edit a warehouse item / object
```

```
DELETE => http://localhost:8080/warehouse/:id

Delete a warehouse item / object
```

#

> ### Inventory API

```
GET => http://localhost:8080/inventory

Returns the list of all inventory
```

```
GET => http://localhost:8080/inventory/:id

Returns an inventory item by id
```

```
PUT => http://localhost:8080/inventory/:id

Edit an inventory item by id
```

```
POST => http://localhost:8080/inventory

Post a new inventory item
```

```
DELETE => http://localhost:8080/inventory/:id

Delete an inventory item
```
