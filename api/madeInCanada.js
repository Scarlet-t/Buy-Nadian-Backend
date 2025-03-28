//https://madeincanadadirectory.ca/cat/canadian-food/

// need to:
// either
// 1. get all the brands under categories "food" and "beverage" from madeincanadadirectory
    // options:
    // 1. fetch 1 time, store somewhere
    // 2. fetch then put in mongo or smth then write a mongo handler
// OR
// 2. make a function with parameter "brandName"
    // 1. searches "brandName" from madeincanadadiretory
    // 2. looks through all the results and returns the item with a matching brand name (maybe filter category by food, then drink??)
        // (as it searches by keyword so anything that contains "brandName" in it  gets returned)
